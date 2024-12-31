import { Route, Routes } from 'react-router-dom'
import './App.css'
import BooksList from './components/Books/booksList'
import Header from './components/Header/header'
import Home from './components/Home/home'
import Footer from './components/Footer/footer'

function App() {

  return (
    <>
      {/* <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BooksList />} />
      </Routes>
      <div className='footer'>
        <Footer></Footer>
      </div> */}

      {/* <header className="header">
          <Header></Header>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BooksList />} />
          </Routes>        </main>

        <footer className="footer">
          <Footer></Footer>
        </footer> */}

      <div className="container">
        <header className="header">
          <Header></Header>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BooksList />} />
          </Routes>
        </main>

        <footer className="footer tiro-devanagari-marathi-regular">
          <Footer></Footer>
        </footer>
      </div>
    </>
  )
}

export default App
