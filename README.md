# [Software Reconstruction of URBAN5](https://c0delab.github.io/URBAN5/)

&nbsp;
![](https://github.com/c0deLab/URBAN5/blob/master/docs/readme/imgs/hardware2.png?raw=true) ![](https://github.com/c0deLab/URBAN5/blob/master/docs/readme/imgs/scrnsht2.png?raw=true)

&nbsp;

URBAN5 is an experimental software for urban design developed by Nicholas Negroponte in 1968 at MIT. It was originally programmed in FORTRAN and ran on an IBM2250 computer. URBAN5 was meant to test the feasibility of language input in a process of urban design. It sought to enact a sort of intelligent design assistant able to converse with users and thus help "democratize" design and planning. However, by its author's own admission, URBAN5 was never functional and "inexhaustibly printed garbage." 

This software reconstruction approximates some of this system's functionality and intent, piecing together the system from descriptions by its author across several publications. The reconstruction offers access to the author's ambition to bring contemporary ideas about language processing and artificial intelligence into the realm of architecture and urban desing — and to the difficulties of its implementation. 

This URBAN5 reconstruction was developed by Erik Ulberg (MSCD '20) in 2019 under the supervision of Prof. Daniel Cardoso Llach at the Computational Design Laboratory at Carnegie Mellon University. The reconstruction is part of "Experimental Archaeology of CAD," a research project combining historical research and technology prototyping in order to examine the origins and speculate about the future of computation in design initiated by Prof. Cardoso in 2017.

Demo: [https://c0delab.github.io/URBAN5/](https://c0delab.github.io/URBAN5/)

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
Current predefined rules: No objects floating, no objects below ground, no roof without building below

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
## Using the Demo App

The demo can be accessed [online](https://c0delab.github.io/URBAN5/) or run locally. 

### Hot Key Controls (Browser)

The online demo uses mouse and keyboard instead of touch interaction and external control pad.

#### Switch Mode:

1: TOPO

2: DRAW

3: SURFACE

4: CIRCULation

5: START

6: RESTART

7: STORE

8: PANIC (Help)

#### Debug View:

F1: Main View

F2: Combined View

F3: DEBUG: Perspective View

F4: DEBUG: View Constraints and Metrics

&nbsp;
## Running the App Locally

Download the project: *[URBAN5](https://github.com/c0deLab/URBAN5/archive/master.zip)*

Then, navigate to the folder in the command line and enter the following to open the app in Google Chrome in kiosk mode at port 8000:

```
python run.py -p 8000
```

To change the port number, update the timeout for sleep mode (in minutes), or disable kiosk mode, use flags:

```
python run.py -p 8008 -t 5 -k False
```

If a change has been made to the source code, the project must be rebuilt to reflect the change. Use the `-b` flag set to `True`:

```
python run.py -b True
```


### Optional Flags Include:
`-k`

If True, kiosk mode is true: opens app in Chrome in kiosk mode and disables the mouse cursor and hotkeys. Otherwise, opens app in normal Chrome and enables mouse and hot key interaction. Defaults to True.

`-p`

Port number for server, defaults to 8000.

`-t`

Number of minutes for timeout to return app to sleep/demo mode.

`-b`

If True, create fresh build, else use existing. Defaults to False.

### Troubleshooting:
If a problem is encountered, try the following:

-Make sure Python 3 is installed.

-Try changing the port number with something like `-p 8001` in case the port is still in use.

## Local Setup For Development
To setup the code for local editing, clone the repo using *[git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)*:

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

To run the test suite (currently only tests constraints):

```
npm run test
```

...or...

```
yarn test
```

### Updating the Help Pages and Demo

The help text and videos can be found in the src/ folder in Demo.js, HelpPage.js, and UserSession.js (the start help text). These files use JSX to specify the text and videos in HTML. 

Videos and images should be placed in in the public/imgs/ folder and can be referenced with a relative path like so: `<img src="./imgs/topoDemo.gif" />`. Using this style of path will allow it to work on GitHub, in development, and from a local build folder.

### Updating the Control Pad Key Mapping

The control pad keys should be mapped when introducing a new control pad. These mappings can be specified in the file: src/controlPadMapping.js. Instructions are included in that file.

### Updating Constraint Mappings

Updates to what constraint text inputs match the three available constraints can be added in the file: src/controlPadMapping.js. Instructions are included in that file.
