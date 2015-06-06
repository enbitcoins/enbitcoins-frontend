# enBitcoins Frontend

[![Build Status](http://img.shields.io/travis/enbitcoins/enbitcoins-frontend.svg?style=flat-square)](https://travis-ci.org/enbitcoins/enbitcoins-frontend)
[![Dependency Status](http://img.shields.io/david/enbitcoins/enbitcoins-frontend.svg?style=flat-square)](https://david-dm.org/enbitcoins/enbitcoins-frontend)
[![devDependency Status](http://img.shields.io/david/dev/enbitcoins/enbitcoins-frontend.svg?style=flat-square)](https://david-dm.org/enbitcoins/enbitcoins-frontend#info=devDependencies)
[![Code Climate](http://img.shields.io/codeclimate/github/enbitcoins/enbitcoins-frontend.svg?style=flat-square)](https://codeclimate.com/github/enbitcoins/enbitcoins-frontend)


## Prerequisite Technologies
### Linux
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.

If you're using Ubuntu, this is the preferred repository to use...

```bash
$ curl -sL https://deb.nodesource.com/setup | sudo bash -
$ sudo apt-get update
$ sudo apt-get install nodejs
```

* *Git* - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it.

### Windows
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.
* *Git* - The easiest way to install git and then run the rest of the commands through the *git bash* application (via command prompt) is by downloading and installing <a href="http://git-scm.com/download/win">Git for Windows</a>

### OSX
* *Node.js* -  <a href="http://nodejs.org/download/">Download</a> and Install Node.js or use the packages within brew or macports.
* *git* - Get git <a href="http://git-scm.com/download/mac">from here</a>.

## Prerequisite packages

* DoggerJS currently works with gulp.
```
$ npm install -g gulp
// and bower
$ npm install -g bower 
```

## Installation
You just need to clone this repo and start your development.


```bash
$ git clone https://github.com/enbitcoins/enbitcoins-frontend.git <my-app>
$ cd <my-app> && npm install
```

### Running
DoggerJS supports the gulp task runner for various services which are applied on the code.
To start compiling your application run:
```bash
$ gulp
```

This gulp task will compile your templates and sass files, optimize images, javascripts, css and create the public directory.

After that, you need to run the local server:
```bash
$ node server
```
Then, open a browser and go to:
```bash
http://localhost:8080
```

### Testing
If you need to test your javascript code, just run:
```bash
$ gulp test
```

This task, will check all *.js* files and will notificate you about warnings and errors.
