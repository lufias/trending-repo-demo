import { useDispatch, useSelector } from 'react-redux';
import { toggleTrendingItemSetting, selectTrendingItemSettings } from '../store/slices/settingsSlice';

function Settings() {
  const dispatch = useDispatch();
  const settings = useSelector(selectTrendingItemSettings);

  const handleToggle = (setting: keyof typeof settings) => {
    dispatch(toggleTrendingItemSetting(setting));
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Settings</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700">Trending Item Display</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Title</span>
                <button
                  disabled
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-not-allowed"
                >
                  <span className="sr-only">Title visibility</span>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avatar</span>
                <button
                  onClick={() => handleToggle('showAvatar')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.showAvatar ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Avatar visibility</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                      settings.showAvatar ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tags</span>
                <button
                  onClick={() => handleToggle('showTags')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.showTags ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Tags visibility</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                      settings.showTags ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Description</span>
                <button
                  onClick={() => handleToggle('showDescription')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.showDescription ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Description visibility</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                      settings.showDescription ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stars</span>
                <button
                  onClick={() => handleToggle('showStars')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.showStars ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Stars visibility</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                      settings.showStars ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 