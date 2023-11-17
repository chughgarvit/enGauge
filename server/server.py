import asyncio
import json
import os
import signal

import websockets

from functions import addNewPerson, processContent, replyScore, requestClient
from classes import TDataset


MEETS = {}

async def handler(websocket, path):
    async for message in websocket:
        msg = json.loads(message)
        if msg["event"] == "init":
            print("addNewPerson called")
            await addNewPerson(websocket, msg, MEETS)
            print("*")
            print(MEETS)
            print("*")

        elif msg["event"] == "content":
            print("processContent called")
            await processContent(msg["meetCode"], MEETS, msg["data"])
            print("**")
            print(MEETS)
            print("**")

        elif msg["event"] == "request":
            print("replyScore called")
            await requestClient(msg["meetCode"], MEETS, "frames")
            print("***")
            print(MEETS)
            print("***")

        elif msg["event"] == "reply":
            print("replyScore called")
            await replyScore(websocket, msg, MEETS)
            print("****")
            print(MEETS)
            print("****")


async def main():
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)

    port = int(os.environ.get("PORT", "8001"))
    async with websockets.serve(handler, "", port):
        await stop

asyncio.run(main())

