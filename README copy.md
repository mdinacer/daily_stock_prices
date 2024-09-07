
# Stock Price Analysis and Visualization

## Description

This project is a Next.js 14 application that analyzes and visualizes stock price data for multiple tech companies. The application allows users to select a stock, define a date range, and choose an analysis type. The results are displayed in both tabular and chart formats. The app uses server actions for data processing, including retrieving stock data and calculating daily returns. This project demonstrates proficiency in Next.js server actions, TypeScript, Tailwind CSS, and data visualization using Recharts.

## Features

- **Stock Data Retrieval:** Fetch stock price data based on ticker and date range.
- **Daily Returns Calculation:** Compute daily returns for selected stocks.
- **Interactive UI:** Select stocks, date ranges, and analysis types using a form.
- **Data Visualization:** Display stock data and analysis results in both tables and charts.
- **Stock Comparison:** Compare multiple stocks' performance over a defined period.

## Technologies Used

- **Next.js 14**: App Router for server actions and efficient data handling.
- **TypeScript**: Strong typing and interfaces for better code quality and maintainability.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Hook Form**: Manage form state efficiently.
- **ShadCN UI**: Pre-built UI components and table with filtering functionality.
- **Recharts**: Data visualization library for rendering dynamic charts.

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (version 16 or later)
- npm or any other package manager (e.g., Yarn)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   Alternatively, you can use Yarn:
   ```bash
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Or with Yarn:
   ```bash
   yarn dev
   ```

4. **Open the application in your browser:**
   Navigate to `http://localhost:3000` to view the application.

### Project Structure

- **/app:** Contains the core pages and components of the application.
- **/components:** Reusable React components for UI and forms.
- **/lib:** Server actions for data processing and calculations.
- **/styles:** Tailwind CSS configuration and global styles.
- **/tests:** Unit tests for data analysis functions.

### Testing

Run unit tests with the following command:

```bash
npm run test
```

Or with Yarn:

```bash
yarn test
```

### Usage

1. Select the desired stock ticker and date range from the form.
2. Choose the type of analysis you want to perform (e.g., daily returns).
3. View the results displayed in a dynamic chart.
4. Compare multiple stocks using the main chart with multiple analysis type.

## Documentation

- **Code Comments:** Inline comments are provided for complex logic and calculations.
- **Function Documentation:** Each function in the server actions and data analysis includes documentation detailing its purpose, input, and output.

