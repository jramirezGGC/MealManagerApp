```
$$\      $$\                     $$\       $$\      $$\                                                             
$$$\    $$$ |                    $$ |      $$$\    $$$ |                                                            
$$$$\  $$$$ | $$$$$$\   $$$$$$\  $$ |      $$$$\  $$$$ | $$$$$$\  $$$$$$$\   $$$$$$\   $$$$$$\   $$$$$$\   $$$$$$\  
$$\$$\$$ $$ |$$  __$$\  \____$$\ $$ |      $$\$$\$$ $$ | \____$$\ $$  __$$\  \____$$\ $$  __$$\ $$  __$$\ $$  __$$\ 
$$ \$$$  $$ |$$$$$$$$ | $$$$$$$ |$$ |      $$ \$$$  $$ | $$$$$$$ |$$ |  $$ | $$$$$$$ |$$ /  $$ |$$$$$$$$ |$$ |  \__|
$$ |\$  /$$ |$$   ____|$$  __$$ |$$ |      $$ |\$  /$$ |$$  __$$ |$$ |  $$ |$$  __$$ |$$ |  $$ |$$   ____|$$ |      
$$ | \_/ $$ |\$$$$$$$\ \$$$$$$$ |$$ |      $$ | \_/ $$ |\$$$$$$$ |$$ |  $$ |\$$$$$$$ |\$$$$$$$ |\$$$$$$$\ $$ |      
\__|     \__| \_______| \_______|\__|      \__|     \__| \_______|\__|  \__| \_______| \____$$ | \_______|\__|      
                                                                                      $$\   $$ |                    
                                                                                      \$$$$$$  |                    
                                                                                       \______/                     
```


* **Meal Manager is a Group Project for GGC CapStone during Spring 2025 Semester**

* **Meal Manager is a mobile application that allows users to create preparation meals that will be stored in the freezer or fridge to then be displayed with the image of the meal, description of the meal, and ingredients used with the calorie amount listed. The user can also move their meals to the freezer or fridge (depending on what they want to eat within the hour or following days) to thaw out or freeze. Whenever the user creates a meal, that meal will be stored in a feature that saves their recent meals so that the user can go back and create that meal again!**  

* **The ideal user for this mobile application would be for those who want to keep a close track record of their meals and the calorie intake so that they can either improve their diet or prevent food waste. **

# Team
* **Paul Berger**
    * Code Architect, Team Lead
* **Bao Nguyen**
    * Code Architect, Data Modeler
* **Julian Ramirez**
    * UI/UX Designer, Documentation Lead

# Requirements
Meal Manager is hosted on FireBase.

To run the program, you need an IDE that can run React, React Native, Expo, and TypeScript (Preferably Visual Studio Code). Yarn is used in this program so that the user can easily install all the packages.

To run the application, the user must run it on the IDE terminal with an andriod or ios emulator. Or, the user can run the application and use Expo Go on their mobile device to use the application.

# Out-of-Box Installation
 * At this time, the Out-of-Box installation is the same as the Developer installation.  Please refer to the Developer Installation section for instructions.

# Developer Installation /* You can remove the examples after youre done and this comment too. */
**1. Clone the master branch of this repository.**
   ```
   git clone https://github.com/PaulBerger56/Steampowered/
   ```  
<br>

**2. Install Maven on the machine (This step is optional because there is a Maven Wrapper inside the Project itself)**
   * https://maven.apache.org/install.html 

<br>
 
**3. Run Maven in a terminal inside the root folder of the project.  It is recommended to open the project in your preferred IDE and starting a new terminal there. This will install and update all dependencies, but the project will not be fully functional yet.**
   
   * If you have maven installed on the machine, run this command:
     ```
     mvn clean spring-boot:run
     ```
   * If you do not have Maven installed on the machine, run this command:
     ```
     ./mvnw clean spring-boot:run
     ```
<br>

**4. Create your own firebase database and attach it to the program.**

  * Create a Firebase account and click Add Project on the console page. Fill in your credentials and click create project.
     * https://firebase.google.com
       
  * Once in the new project, click on the firestore tab. On the next page, click create database, then select your server location and press next.  On the next page, select Start in test mode and press create.
  
  * After the database has been made, click the cog wheel in the side bar and then click on Project settings.
     * Once on the project settings page, click on the Service accounts tab.
     * In the Admin SDK configuration snippet box, click the Java radio button.  Once the code is updated to java, press the generate new private key button at the bottom.  This will download a JSON file to your machine.
     * Rename this JSON file serviceAccountKey.json and add it to the root folder of Steampowered.  This file needs to be renamed precisely so that the code recognizes it and it is properly added to the gitignore to keep your information from being uploaded to github.

<br>


**5. Run the code**

 * Repeat step 3 with whichever Maven command you used then.
 * If you get any errors here, check the dependencies in the pom.xml.  Depending on how long from the time we built this project, they could have been updated.
 * Once you see the project loaded in the terminal, open a web browser and go to localhost:8080
 * At this point the website should work as intended.  There will be a very long delay between when you log in with the Steam openId and being redirected to the wheel page.  This is due to the fact that your database is empty and the code is having to make a call for each game in your library.  Once several people log in, the database will start to fill and this login time will be reduced significantly.

# License

This software is protected under the [GNU General Public License](http://www.gnu.org/licenses/gpl.html)
You may use it, provided that any modifications you make to it are available for
others to use and modify in a similar manner.

# Dependencies
Release       | Short Description
------------- | -------------
[Expo Vector Icons](https://docs.expo.dev/guides/icons/) | Various types of icons to use for Expo and React Native. **Version: ^14.0.2**
[React Native Async Storage](https://reactnative.dev/docs/asyncstorage) | AsyncStorage is an unencrypted, asynchronous, persistent, key-value storage system that is global to the app. **Version: ^2.1.2**
[React Native Navigation](https://reactnative.dev/docs/navigation) | React Navigation provides a straightforward navigation solution, with the ability to present common stack navigation and tabbed navigation patterns on both Android and iOS. **Version: ^7.0.14**
[Expo](https://docs.expo.dev/bare/installing-expo-modules/) | The expo package has a small footprint; it includes only a minimal set of packages that are needed in nearly every app and the module and autolinking infrastructure that other Expo SDK packages are built with. **Version: 52.0.38**
[Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/) | Expo file system provides access to a file system stored locally on the device. It is also capable of uploading and downloading files from network URLs. **Version: ^18.0.12**
[Expo Font](https://docs.expo.dev/versions/latest/sdk/font/) | Expo font allows loading fonts from the web and using them in React Native components. **Version: 13.0.4**
[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) | Expo image picker provides access to the system's UI for selecting images and videos from the phone's library or taking a photo with the camera. **Version: ^16.0.6**
[Expo Linking](https://www.npmjs.com/package/expo-linking) | Create and open deep links universally. **Version: ~7.0.5**
[Expo Router](https://docs.expo.dev/router/installation/) | It allows you to manage navigation between screens in your app, allowing users to move seamlessly between different parts of your app's UI, using the same components on multiple platforms (Android, iOS, and web). **Version: 4.0.19**
[Expo Splash Screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/) | Expo splash screen, is a dependency in Expo projects that manages the splash screen behavior, ensuring it's visible until the app is fully loaded. **Version: ~0.29.21**
[Expo Status Bar](https://docs.expo.dev/versions/latest/sdk/status-bar/) | gives you a component and imperative interface to control the app status bar to change its text color, background color, hide it, make it translucent or opaque, and apply animations to any of these changes. **Version: ~2.0.1**
[Expo System UI](https://docs.expo.dev/versions/latest/sdk/system-ui/) | Expo system UI enables you to interact with UI elements that fall outside of the React tree. Specifically the root view background color, and locking the user interface style globally on Android. **Version: ~4.0.7**
[Expo Web Browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/) | Expo web browser provides access to the system's web browser and supports handling redirects. **Version: ~14.0.2**
[FireBase](https://docs.expo.dev/guides/using-firebase/) | Firebase is a Backend-as-a-Service (BaaS) app development platform that provides hosted backend services such as real-time database, cloud storage, authentication, crash reporting, analytics, and so on. It is built on Google's infrastructure and scales automatically. **Version: ^11.5.0**
[FireBase Tools](https://www.npmjs.com/package/firebase-tools) | The Firebase Command Line Interface (CLI) Tools can be used to test, manage, and deploy your Firebase project from the command line. **Version: ^14.2.0**
[React](https://react.dev/learn/installation) | React core library (must-have). **Version: 18.3.1**
[React Dom](https://www.npmjs.com/package/react-dom) | This package serves as the entry point to the DOM and server renderers for React. It is intended to be paired with the generic React package, which is shipped as react to npm. **Version: 18.3.1**
[React Native](https://reactnative.dev/docs/environment-setup) | Core React Native framework. **Version: 0.76.7**
[React Native ReAnimated](https://www.npmjs.com/package/react-native-reanimated) | React Native Reanimated provides a more comprehensive, low-level abstraction for the Animated library API on which to build, allowing for much greater flexibility, especially when it comes to gesture-based interactions. **Version: ~3.16.1**
[React Native Safe Area Context](https://www.npmjs.com/package/react-native-safe-area-context) | Handles safe area padding. **Version: 4.12.0**
[React Native Screens](https://www.npmjs.com/package/react-native-screens) | It's commonly used with react-navigation to optimize screen performance. **Version: ~4.4.0**
[React Native Web](https://www.npmjs.com/package/react-native-web) | Allows React Native components to run in a web browser, often used in Expo for web support. **Version: ~0.19.13**
