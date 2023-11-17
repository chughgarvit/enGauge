# enGauge: Monitoring Listener Focus in Online Meetings using Ear-Based Inertial Sensing

## Abstract

This repository contains the code and resources for the research paper titled "Exploring Earables to Monitor Temporal Lack of Focus during Online Meetings to Identify Onset of Neurological Disorders." The paper introduces enGauge, a framework leveraging ear-based inertial sensing to monitor listener focus levels in online meetings continuously. enGauge provides real-time feedback to speakers, aiding in the identification of neurodevelopmental disorders like ADHD. The system enhances online meeting effectiveness by allowing speakers to adapt their communication based on audience engagement. The proposed approach combines contrastive learning with a judicious selection of anchor events from meeting contents to model the system. enGauge accurately detects patterns or shifts in behavior and focus levels, showcasing its potential for early detection and monitoring of neurodevelopmental disorders. A user study with 38 participants demonstrated an impressive overall F1-score of 0.89 for detecting passive listeners' focus levels.

## Authors

- Garvit Chugh, IIT Jodhpur, India
- Suchetana Chakraborty, IIT Jodhpur, India
- Ravi Bhandari, JCKIF, IIT Jodhpur, India
- Sandip Chakraborty, IIT Kharagpur, India

## Citation

```
@INPROCEEDINGS{10183685,
  author={Chugh, Garvit and Chakraborty, Suchetana and Bhandari, Ravi and Chakraborty, Sandip},
  booktitle={2023 IEEE/ACM Conference on Connected Health: Applications, Systems and Engineering Technologies (CHASE)}, 
  title={Exploring Earables to Monitor Temporal Lack of Focus during Online Meetings to Identify Onset of Neurological Disorders}, 
  year={2023},
  volume={},
  number={},
  pages={126-137},
  doi={10.1145/3580252.3586981}
}
```

## Paper Link

[Read the full paper here](https://ieeexplore.ieee.org/document/10183685/)

## File Descriptions

## Client Installation and Server Setup

### Client Installation

#### How To Install

1. Download the zip file from the repository and extract its contents.
2. Open the Chrome browser and click on the options button.
3. Select "More Tools" and then choose "Extensions" in the Options Menu.
4. Turn on Developer Mode.
5. Click on "Load Unpacked."
6. Select the extracted folder.
7. Your extension is now installed.

#### How To Use

1. Ensure the participant window is open.
2. The process is now started. Click on the extension to view the desired results.

### Server Setup

#### Steps to Run the Server

Run the following command in your terminal:

```bash
python3 server.py -m http.server
```

For any questions or issues, please contact Garvit Chugh at [chugh.2@iitj.ac.in](mailto:chugh.2@iitj.ac.in).

Feel free to explore and contribute to the enGauge project. If you encounter any issues or have questions, the contact email is available for assistance.
