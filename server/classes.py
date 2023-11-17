import torch.nn as nn
import torch

from torch.utils.data import Dataset


class Person:
    def __init__(self, ws, name, uid, role):
        self.ws = ws
        self.name = name
        self.uid = uid
        self.role = role
        self.presence = 0
        self.num_frames = 0

    def __repr__(self):
        return self.name


class featureConvNet(nn.Module):
  def __init__(self):
    super().__init__()
    self.l1 = nn.Conv1d(1,16,3)
    self.l2 = nn.Conv1d(16,32,3)
    self.lin = nn.Linear(32*2, 6)
    self.head = nn.Linear(6, 3)
    self.body = nn.Linear(6, 1)
    self.face = nn.Linear(6, 1)

    self.relu = nn.ReLU(inplace = True)

  def forward(self, data):
    data = self.relu(self.l1(data))
    data = self.relu(self.l2(data))
    data = data.flatten(start_dim=1)
    #print(data.size())
    data = self.relu(self.lin(data))
    head = self.head(data)
    body = self.body(data)
    face = self.face(data)

    return head, body, face


class ComConvModel(nn.Module):
  def __init__(self):
    super().__init__()
    self.feature = featureConvNet()
    self.lin = nn.Linear(5,3)
    self.lin2 = nn.Linear(3,1)
    self.relu = nn.ReLU(inplace = True)
    self.sig = nn.Sigmoid()

  def forward(self, data):
    head, body, face = self.feature(data)
    concat = torch.cat((head, body, face), dim=1)
    concat = self.relu(concat)
    attn = self.relu(self.lin(concat))
    attn = self.lin2(attn)
    attn = self.sig(attn)

    return attn


class TDataset(Dataset):
  def __init__(self, csv):
    self.samples = csv

  def __len__(self):
    return len(self.samples)
  
  def __getitem__(self, idx):
    row = self.samples.iloc[idx]
    label = torch.tensor(row['state']).float()
    feat = torch.tensor([row['Ax'], row['Ay'], row['Az'], row['Gx'], row['Gy'], row['Gz']]).float()
   
    return feat, label
