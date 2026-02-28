'use client'

import dynamic from 'next/dynamic'

const LeadsOverview = dynamic(
  () => import('@/components/shared/widgets/LeadsOverview'),
  { ssr: false }
)

export default function LeadsOverviewLoader() {
  return <LeadsOverview />
}
