import BannerImageDialog from "./BannerImageDialog"
import Banners from "./Banners"

const Settings = () => {
  return (
    <>
        <div className="container px-4 mx-auto">
            <div className="mt-6 flex items-center gap-2 justify-between">
                <h3 className="font-bold text-lg text-nowrap">Settings</h3>
            </div>
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Banners</h4>
                    <BannerImageDialog trigger={ <button className="text-xs text-white py-2 px-4 rounded bg-cyan-700">Add Banner</button> } />
                </div>
                <div className="mt-2">
                    <Banners />
                </div>
            </div>
        </div>
    </>
  )
}

export default Settings
