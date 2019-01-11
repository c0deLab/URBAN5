# [URBAN5](https://c0delab.github.io/URBAN5/)

## Archaeology of CAD: URBAN 5

<img style="float: right;" src="https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/hardware.png?raw=true">

URBAN5 (1970), a project by Nicholas Negroponte, was started with the goal to “study the desirability and feasibility of conversing with a machine about an environmental design project.” The purpose of this project is not an exact replica of the original with the same hardware and software, but rather an approximation using modern tools to enrich our understanding of the device. As foundational research in the field of computational design, URBAN5 helped shape the way we approach the topic today. By digging into this piece of our past, we can uncover the unconscious assumptions and practices built into our modern systems, thus allowing us to reimagine our methods and discover new ones.  

Demo: [https://c0delab.github.io/URBAN5/](https://c0delab.github.io/URBAN5/)

## Controls

A user can select the light buttons on the right menu to choose what their action is, however, there are also hotkeys for quicker testing:

v: 2D slice view  
b: 3D walk through  
x: north slice view  
a: east slice viewv
w: south slice view  
d: west slice view  
s: top plan view  
c: bottom plan view  
1: add cube  
2: add tree  
3: add roof left  
4: add roof right  
5: remove element  
↑: move forward in 3D walk through  
↓: move backward in 3D walk through  
p: show debugging mode  


# Annotated Guide to URBAN5

![Original](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/original.png?raw=true)

## User Interface

The current version has a text area at the top for text interaction, a menu on the right to show options, and a main screen that renders cubes, roofs, trees, and topography.

![UI original](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/slice.png?raw=true)
![UI current](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/slice_scrn.png?raw=true)

(Side-by-side screenshots of current version and original (Negroponte, 1970))

## Add/Remove

The current version allows a user to add and remove cubes, roofs (slanted east and west), and trees. The cubes and roofs join automatically.

![UI current](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/slice4.png?raw=true)
![UI original](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/slice3.png?raw=true)


## Navigate Slices

It allows travel through slices.

![UI original](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/slice0.png?raw=true)
![UI current](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/slice1.png?raw=true)
![UI current](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/slice2.png?raw=true)


## Rotation

In addition to rotating to north, east, south, and west slice views, the user can see plans from top or bottom.

![UI original](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/plan.png?raw=true)
![UI current](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/plan_scrn.png?raw=true)

(Side-by-side screenshots of current version and original (Negroponte, 1970))

## 3D Walk-through

There is a 3D view to simulate a person walking around under construction. It currently takes a set of camera positions and animates the journey. However, it does not join cubes and roofs or render trees or topography correctly.

![UI original](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/3d_walkthrough.png?raw=true)
![UI current](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/3d_walkthrough_scrn.png?raw=true)

(Side-by-side screenshots of current version and original (Negroponte, 1970))

## Debugging View

For debugging purposes, there is a developer view wrapped around the current view that shows all slices from each of the 6 camera views and the current slice locations.

![UI original](https://github.com/c0deLab/URBAN5/blob/master/docs/imgs/debug.png?raw=true)


# Local Setup

Download the source code, then run:

yarn install

yarn start

To Deploy to gh-pages:

yarn deploy
