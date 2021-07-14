# SecureJournal
password protected programming journal made with node.js and ejs

Since this is designed as a personal journal.
I commented out the register path in app.js

Uncomment to use once and create your username and password.

On the  login.ejs page, I gave the username input a hidden visibility.
And a value of "Anthony" which is my test username.
Change the value to your username. 

This way when there is a post request from '/login' the username will appear as that value. 
This is optional but I find useful because it removes the need to enter your username everyday.

journal entries designed to look like writing on a chalkboard. Wood wallpaper from "https://www.transparenttextures.com/"


Uses passport login strategy and creates cookies.
Embedded javascript was used because the body of all pages will have the same background as well as the same header and footer




