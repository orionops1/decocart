import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { PackagesPage } from '@/pages/PackagesPage'
import { BookingPage } from '@/pages/BookingPage'
import { TrackingPage } from '@/pages/TrackingPage'
import { Layout } from '@/components/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/book/:slug" element={<BookingPage />} />
          <Route path="/track/:id" element={<TrackingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
