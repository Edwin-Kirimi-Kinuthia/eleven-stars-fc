import type { Metadata } from 'next'
import SquadClient from './SquadClient'

export const metadata: Metadata = {
  title: 'Squad',
  description: 'Meet the Eleven Stars FC squad — Conference League players.',
}

export default function SquadPage() {
  return <SquadClient />
}
