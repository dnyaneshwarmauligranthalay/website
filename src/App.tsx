import { Route, Routes } from 'react-router-dom'
import './App.css'
import BooksList from './components/Books/booksList'
import Header from './components/Header/header'
import Home from './components/Home/home'
import Footer from './components/Footer/footer'
import About from './components/About/about'

function App() {

  return (
    <>
      <div className="container">
        <header className="header">
          <Header></Header>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/about" element={<About />} />
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
