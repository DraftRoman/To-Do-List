# To-Do List

Goal: Develop a single-page web application for managing to-do lists. The application should provide the user with a simple and intuitive interface for adding, completing, and deleting tasks.

## 2. Core Functionality

The user should be able to:

Add new tasks: Enter the task text in a dedicated field and add it to the main list by clicking a button or pressing Enter.

Mark tasks as completed: Clicking on a task should change its visual style (for example, by crossing it out). Clicking again should return the task to its active state.

Delete tasks: Each task should have a button for completely deleting it from the list.

View the current date: The application header should display the current date for user convenience.

## 3. User Interface (UI/UX) Requirements

Design: The application's appearance should strictly correspond to the provided Figma mockup.

Responsiveness: The interface must be fully responsive and display correctly on all types of devices, including mobile phones, tablets, and desktop computers.

Color Schemes: Two color schemes must be implemented:

Light (daytime): Used by default.

Dark (nighttime): Enabled by clicking a dedicated toggle button.

Theme Preservation: The user's chosen color scheme must be preserved between sessions (upon page refreshes).

## 4. Structure

Layout (HTML):

Use semantic markup with <main>, <section>, <header>, and <footer> tags to improve accessibility and SEO.

Styling (CSS):

Use CSS variables to manage the color palette, margins, fonts, and other recurring values, which will simplify theme implementation and code maintenance.

For all scalable values ​​(font sizes, margins, block sizes), use relative rem units to ensure accessibility and proper responsiveness.

Scripting (JavaScript):

All interactive functionality should be implemented in pure (vanilla) JavaScript.

Use localStorage in the browser to save the selected theme.

Dependencies:

Use the Font Awesome library for icons.

For fonts, use Google Fonts (Roboto family).

## 5. Environment Requirements

Browser Support: The application must work correctly in the latest two versions of the following browsers:

Google Chrome

Mozilla Firefox

Apple Safari

Microsoft Edge
