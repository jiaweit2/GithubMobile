# GithubPro
A react native app that demo your profile<br>
<pre>
<p align="center">
  <img width=150 height=310 src='assets/images/demo2.png'>    <img width=150 height=310 src='assets/images/demo1.png'>
</p>
</pre>


## Features
- Log in with your Github username and password(using Github Basic OAuth)
- Display your basic info(repos, followers, followings, etc.)
- Search and follow a new user
- Search any repo and visualize its stats(languages use, commits in past 6 weeks)
- Display your unread notification


## Install
1. Follow [instructions](https://docs.expo.io/versions/v35.0.0/get-started/installation/) to install Expo
2. Clone and go to GithubPro/, run ```npm install```
3. Use ```expo start``` to start

If encounter error:
```
"fontFamily ionicons" is not a system font and has not been loaded through Font.loadAsync.
```
run ```expo install react-native-vector-icons``` to install and link the dependency
