import base64
import json
from datetime import datetime

import numpy as np
import os
import pandas as pd

AGGREGATE = 0
NUM_AUDI = 0
PRSNT_SCORE = 0
TIMER = None
TIME_DELAY = 5
SERVERPATH = '/home/soman/Garvit/New/server/'


import torch
import torch.nn as nn
import torch.nn.functional as func
import torch.optim as op

from torch.utils.data import Dataset


from classes import ComConvModel, featureConvNet, TDataset, Person


device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

model = ComConvModel()
state = torch.load(SERVERPATH + 'models/engagementestimation_contrastive.pth')
model.load_state_dict(state['state_dict'])
model = model.to(device)
model.eval()

df = pd.read_pickle(SERVERPATH + 'models/garvitFinal.pkl')
dataset = TDataset(df)

length = len(dataset)
split = int(0.2 * length)
indices = list(range(length))

train_indices, test_indices = indices[split:], indices[:split]

testloader = torch.utils.data.DataLoader(dataset, batch_size=1, sampler=val)
print(len(testloader))

# dt = next(iter(testloader))
# feat, label = dt
# print(feat.size(), label.size())

def calc_presence(dt):
    feat, label = dt

    pred = model(feat.unsqueeze(1).to(device))
    pred[pred>0.5] = 1
    pred[pred<0.5] = 0

    return int(pred)

async def processContent(meetCode, MEETS, img_uri):
    global TIMER
    if TIMER is None:
        print("START")
        # WE start to ask for frames
        await requestClient(meetCode, MEETS, "frames")
        # Can be an issue
        TIMER = datetime.now()
    elif TIMER is not None and (datetime.now()-TIMER).total_seconds() > TIME_DELAY:
        # We stop due to time out
        print("TIME OUT")
        await requestClient(meetCode, MEETS, "stop")
        TIMER = None
        
        
async def addNewPerson(websocket, msg, MEETS):
    print(msg)
    if msg["meetCode"] not in MEETS.keys():
        MEETS[msg["meetCode"]] = {"Host":{}, "Audi":{}}
    
    person = Person(websocket, msg["name"], msg["uid"], msg["role"])

    if msg["role"] == "Audi":
        adder = {"event": "Add new","name": person.name, "uid":person.uid}
        for host in MEETS[msg["meetCode"]]["Host"].values():
            await host.ws.send(json.dumps(adder))
    else:
        person.name = "Presentation Score"

    if msg["uid"] not in MEETS[msg["meetCode"]][msg["role"]].keys():
        MEETS[msg["meetCode"]][msg["role"]][msg["uid"]] = None

    MEETS[msg["meetCode"]][msg["role"]][msg["uid"]] = person
    del person
    print("New")
    print(MEETS)
    print("New")
        
        
async def requestClient(meetCode, MEETS, request):
    event = None
    if request == "frames":
        event = "Request Frames"
    elif request == "stop":
        event = "Stop Frames"
    for host in MEETS[meetCode]["Host"].values():
        requestJson = {"event": event}
        await host.ws.send(json.dumps(requestJson))

    for member in MEETS[meetCode]["Audi"].values():
        requestJson = {"event": event}
        await member.ws.send(json.dumps(requestJson))
        
        
async def replyScore(websocket, msg, MEETS):
    global AGGREGATE, NUM_AUDI, PRSNT_SCORE, TIMER

    person = MEETS[msg["meetCode"]][msg["role"]][msg["uid"]]

    if not msg["end"]:
        person.num_frames += 1
        # person.presence += calc_presence(msg["data"])
        person.presence += calc_presence(next(iter(testloader)))

    else:
        response = {"event": "Update", "name": person.name, "uid": person.uid, "presence": str(round(100*(person.presence)/(person.num_frames)))}
        await websocket.send(json.dumps(response))
        if msg["role"] == "Audi":
            for host in MEETS[msg["meetCode"]]["Host"].values():
                await host.ws.send(json.dumps(response))
            
            AGGREGATE += round(100*(person.presence)/(person.num_frames))
            NUM_AUDI += 1
            if NUM_AUDI == len(MEETS[msg["meetCode"]]["Audi"].keys()):
                table_response = {"event": "Add Row", "time": datetime.now().strftime("%I:%M:%S %p"), "score": str(PRSNT_SCORE), "aggregate": str(round(AGGREGATE/NUM_AUDI))}
                for host in MEETS[msg["meetCode"]]["Host"].values():
                    await host.ws.send(json.dumps(table_response))
                AGGREGATE = 0
                NUM_AUDI = 0
                PRSNT_SCORE = 0
        else:
            PRSNT_SCORE = round(100*(person.presence)/(person.num_frames))
        person.presence, person.num_frames = 0, 0
        TIMER = None
