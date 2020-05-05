# [Software Reconstruction of URBAN5](https://c0delab.github.io/URBAN5/)

&nbsp;
![](https://github.com/c0deLab/URBAN5/blob/master/docs/readme/imgs/hardware2.png?raw=true) ![](https://github.com/c0deLab/URBAN5/blob/master/docs/readme/imgs/scrnsht2.png?raw=true)

&nbsp;

URBAN5 is an experimental software for urban design developed by Nicholas Negroponte in 1968 at MIT. It was originally programmed in FORTRAN and ran on an IBM2250 computer. URBAN5 was meant to test the feasibility of language input in a process of urban design. It sought to enact a sort of intelligent design assistant able to converse with users and thus help "democratize" design and planning. However, by its author's own admission, URBAN5 was never functional and "inexhaustibly printed garbage." 

This software reconstruction approximates some of this system's functionality and intent, piecing together the system from descriptions by its author across several publications. The reconstruction offers access to the author's ambition to bring contemporary ideas about language processing and artificial intelligence into the realm of architecture and urban desing — and to the difficulties of its implementation. 

This URBAN5 reconstruction was developed by Erik Ulberg (MSCD '20) in 2019 under the supervision of Prof. Daniel Cardoso Llach at the Computational Design Laboratory at Carnegie Mellon University. The reconstruction is part of "Experimental Archaeology of CAD," a research project combining historical research and technology prototyping in order to examine the origins and speculate about the future of computation in design initiated by Prof. Cardoso in 2017.

Demo: [https://c0delab.github.io/URBAN5/](https://c0delab.github.io/URBAN5/)

&nbsp;
## Controls

A user can select the light buttons on the right menu to choose what their action is, however, there are also hotkeys for quicker use:

#### Switch View:

f1: Main View

f2: DEBUG: Perspective View

f3: DEBUG: View Constraints and Metrics

f4: Combined View

#### Swith Mode:

1: DRAW

2: SURFACE

3: TOPO

4: CIRCULation

#### Move Camera:

x: North 

w: South

a: East

d: West 

s: Top

↑: Step In

↓: Step Out

&nbsp;
## Annotated Guide to URBAN5

What follows shows correlations between descriptions of specific URBAN5 functions (excerpted from *The Architecture Machine* (Negroponte, 1971)) and our reconstruction.

### Menu

>Associated with each mode is a string of machine-defined or user-defined text (verbs) that appears as a menu of “light buttons.” Each mode has its own set of light buttons that denote related operations.

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_0.png)

Light buttons for DRAW, TOPO, and SURF modes:

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_1.png) ![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_2.png) ![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_3.png)

&nbsp;
### TOPO

>TOPO displays a **site plan**, for example, which appears as a **grid of altitudes** that the designer can manipulate with his light pen in order to create a warped surface approximating his topography.

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_4.png)

&nbsp;
### DRAW

>DRAW, a separate mode, allows the manipulation of (1) viewing mode (orthographic, perspective), (2) viewing plane (scale, **rotation, translation**)

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/draw.jpg)
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/rotatetranslate.gif)

&nbsp;
>DRAW, a separate mode, allows the manipulation of ...  (3) physical elements (**solids**, **voids**, **roofs**, people, **trees**, vehicles). 
In DRAW mode, when two cubes are place tangent to each other, **the adjoining surface is automatically removed**, thus forming one continuous volume that is inherently part of an external membrane.

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/addremove.gif)

&nbsp;
### SURFACE

>to qualify further external surfaces or add internal surfaces, the designer must enter a new contex, SURFACE mode. In SURFACE mode, any of the six surfaces of the cube can be ascribed one of four (again abstracted and simplified) characteristics: **solid** (defining a major activity boundary), partition (a subdivision of a common usage), transparent, or **absent**. Each of these surface traits can be assigned with or without the attribute of “access."

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/surface.gif)

&nbsp;
### CIRCULation

>For example, in CIRCULation mode a designer can have **the machine simulate pedestrian travel between two points on the site**. **An x, the pedestrian, will prance across the screen trying to get from one point to the next**, searching for a reasonable or at least feasible path. **The machine will report the pedestrian's distance** and time of travel or **else the impossibility of the trip** through lack of enough elements with "access.”

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_9.png)
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_10.png)
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_8.png)

&nbsp;
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/circulation.gif)

&nbsp;
### Store/Load

>The disk was used for temporary files. A user could **store ten “studies"** and **retrieve them**.

&nbsp;
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_12.png)

&nbsp;
### Incompatibilities

>An incompatibility “error message” is a remark upon an incongruity between a designer’s action and a **predefined requisite embedded in the machine**. An incompatibility can cause the machine to signal the user (by **ringing a bell and displaying the message on the top of the screen**) but **allow the action**, or it can cause the machine to refuse to act in cases where the violation is severe. For example, **a cube might be placed floating in midair**. The machine would indeed draw the cube but simultaneously display the message that it was “**not structurally possible at this time**.” However, if a vertical surface is assigned the attribute of access (explicitly by the user) when there is no horizontal surface on one or both sides, URBAN5 refuses to make the qualification and alerts the designer of the problem.

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/incompat.gif)

&nbsp;
Current predefined rules: No buildings floating, no buildings below ground, no roof without building below

&nbsp;
### Conflicts

>A conflict is an inconsistency discerned by the machine relating criteria specified by the designer to forms generated by the designer. A conflict is thus generated when there is an inconsistency between what the architect has said and what he has done. **To state a constraint, the designer must enter INITIALize mode, describe a context, and push the “speak" button** on the typewriter console. At this point he can type a criterion to the machine **using the English language**... 
When URBAN5 finds an inconsistency between what has been said (linguistically) and what has been done (graphically), **it states that a conflict has occurred, it quotes the designer’s statement of criterion, and it displays the present status of the situation**.
**In both cases, conflict and incompatibility, a nauseating bell rings**, making the message auditory as well as visual. 

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_14.png)
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_15.png)
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_16.png)

&nbsp;
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/conflicts.gif)
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_18.png)![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_19.png)
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_20.png)

&nbsp;
### Startup

>the first question is whether this is the user’s first experience with the machine. If it is indeed the first time, the machine presents an unsolicited page of text that describes how to proceed, how to use the hardware, and what to do when the user gets stuck.

![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_21.png)

&nbsp;
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_22.png)
![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_23.png)![](https://github.com/c0deLab/URBAN5/raw/master/docs/readme/imgs/Image_24.png)

&nbsp;

## Running the App
(Instead of opening [https://c0delab.github.io/URBAN5/](https://c0delab.github.io/URBAN5/) in a browser)
### Served Locally:

Download the folder: *[download](https://github.com/c0deLab/URBAN5/archive/master.zip)*

Navigate to the main folder in the command line, then run:

```
python run.py -p 8000
```

With flags example:

```
python run.py -b False -p 8008 -t 5 -k False
```

### Optional Flags Include:
`-k` <True (default)/False>

If True, kiosk mode is true. Opens app in Chrome and disables mouse and some hotkeys.

`-b` <True (default)/False>

If True, create fresh build, else use existing. Defaults to True.

`-p` <Number>

Port number for server, defaults to 8000.

`-t` <Number>

Number of minutes for timeout and return to sleep mode/demo in app.

### Troubleshooting:
-Make sure Python 3 is installed

-In an emergency, you can skip the rebuild with '-b False' (but you are stuck with the last build)

-If you need to rebuild (ie. you made a change to the source code or flags), make sure npm is installed.

-Try changing the port number with something like '-p 8001' in case the port was in use (or run 'lsof -i:$PORT' and then 'kill $pid' to kill the process if you want to free the port).

-Check the source code in run.py to see what is broken.


## Local Setup
To setup the code for local editing, download the source code:

*[git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)*

```
git clone https://github.com/c0deLab/URBAN5.git
```

To build, make sure [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/) is installed on the command line and then, run:

```
npm install
npm run start
```

...or...

```
yarn install
yarn start
```

To deploy to GitHub (gh-pages):

```
npm run deploy
```

...or...

```
yarn deploy
```

Test (currently only tests constraints):

```
npm run test
```

...or...

```
yarn test
```
