import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          width: '100%'
        }}
      >
        <Sidebar activeSection='Home' />
        <div
          className='gap'
          style={{
            flex: 1,
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
