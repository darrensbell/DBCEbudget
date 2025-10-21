# Project Blueprint

## Overview

This project is a web application designed to help theatre producers and investors analyze the financial viability of their productions. The application provides a detailed recoupment analysis, allowing users to create and compare different financial scenarios. The goal is to provide a powerful and user-friendly tool for financial planning and decision-making in the theatre industry.

## Project Outline

### Core Features

*   **Recoupment Analysis:** The core feature of the application is the recoupment analysis page. This page provides a detailed breakdown of the production's costs, revenues, and profits at different capacity levels.
*   **Scenario Management:** Users can create, edit, delete, and switch between different financial scenarios. This allows them to compare the impact of different assumptions on the production's financial performance.
*   **Data Persistence:** The application uses Supabase to store and retrieve data, ensuring that the user's work is saved automatically.
*   **Accessibility:** The application is designed to be accessible to all users, including those who rely on screen readers. The application uses ARIA attributes and other accessibility best practices to ensure that it is usable by everyone.

### Implemented Styles and Designs

*   **Layout:** The application uses a sidebar layout, with the main content area on the right.
*   **Styling:** The application uses Bootstrap for styling, with a custom CSS file for additional styles.
*   **Components:** The application is built with React and uses a number of custom components, including:
    *   `Sidebar`: The sidebar component provides navigation to the different pages of the application.
    *   `Productions`: The productions page displays a list of the user's productions.
    *   `Settings`: The settings page allows the user to configure the application.
    *   `Budget`: The budget page allows the user to create and manage the production's budget.
    *   `RecoupmentPage`: The recoupment page provides a detailed recoupment analysis.
    *   `Scenario`: The scenario component allows the user to manage the different financial scenarios.
    *   `ScenarioModal`: The scenario modal allows the user to create and edit scenarios.
    *   `ConfirmModal`: The confirm modal is a generic modal for confirming actions.

### Future Plans

*   **Improve Accessibility:** Continue to improve the accessibility of the application by adding more ARIA attributes, improving the color contrast, and testing the application with screen readers.
*   **Add More Features:** Add more features to the application, such as the ability to export the recoupment analysis to a PDF file, the ability to share the analysis with other users, and the ability to track the production's actual financial performance against the budget.
*   **Improve the UI:** Continue to improve the user interface of the application by adding more data visualizations, improving the layout, and making the application more intuitive and user-friendly.
