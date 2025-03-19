import '../styles/global.css';

export const metadata = {
  title: 'Investment Portfolio Tracker',
  description: 'A simple app to track and visualize your investment portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          <h1 className="text-3xl font-bold mb-6">Investment Portfolio Tracker</h1>
          {children}
        </main>
      </body>
    </html>
  )
}