import React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setInstallPrompt } from "@/store/slices/pwaSlice"
import { Download } from "lucide-react"

const InstallButton: React.FC = () => {
  const dispatch = useDispatch()
  const { deferredPrompt, isInstallable } = useSelector((state: RootState) => state.pwa)

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      console.log("✅ User accepted the install prompt")
    } else {
      console.log("❌ User dismissed the install prompt")
    }

    // Reset prompt so it's not shown again
    dispatch(setInstallPrompt(null))
  }

  if (!isInstallable) return null

  return (
    <button
      onClick={handleInstall}
      className="px-5 py-2 bg-black hover:bg-black/80 transition ease-in-out duration-300 text-white rounded-lg"
    >
      <Download size={18} />
    </button>
  )
}

export default InstallButton
