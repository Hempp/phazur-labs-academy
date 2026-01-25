import { redirect } from 'next/navigation'

// Redirect /verify-certificate to /verify for backward compatibility
export default function VerifyCertificatePage() {
  redirect('/verify')
}
