import { useContext, useState, useEffect } from "react";
import { SkynetContext } from "../state/SkynetContext";
import Link from "./Link";

const ProfileEditor = () => {
  const { profile, client, userProfile } = useContext(SkynetContext);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState("");
  const [displayPhoto, setDisplayPhoto] = useState("");

  useEffect(() => {
    //set initial state values
    if (profile) {
      setUsername(profile.username);
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setAbout(profile.aboutMe);
      if (profile.avatar[0]) {
        setPhoto(profile.avatar[0].url);
      } else {
        setPhoto(profile.avatar.url);
      }
    }
  }, [profile]);

  useEffect(() => {
    const getDisplayPhotoUrl = async () => {
      const avatar = await client.getSkylinkUrl(photo);
      setDisplayPhoto(avatar);
    };

    if (photo) {
      getDisplayPhotoUrl();
    }
  }, [photo, client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const avatar = photo ? [{ url: photo }] : undefined;
    const updated = { ...profile, username, firstName, lastName, aboutMe: about, avatar };

    // call userprofile dac code here.
    if (userProfile) {
      userProfile.setProfile(updated);
    }
  };

  return (
    <div>
      <div class="mt-10 sm:mt-0">
        <div class="md:grid md:grid-cols-1">
          <div class="px-4 sm:px-0 md:col-span-1">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Profile Editor</h3>
            <p class="mt-1 text-sm text-gray-600">
              You can edit your MySky profile here. This is information ispublic and viewable across Skynet.
            </p>
            <p class="mt-1 text-sm text-rose-600">Any information you've set elsewhere on Skynet may be overwritten.</p>
            <p class="mt-1 text-sm text-blue-600">Todo: Get image uploader working.</p>
          </div>
        </div>
        <div class="md:grid md:grid-cols-3 md:gap-6 mt-6">
          <div class="mt-5 md:mt-0 md:col-span-3">
            <form action="#" onSubmit={(e) => handleSubmit(e)}>
              <div class="shadow overflow-hidden sm:rounded-md">
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div class="grid grid-cols-6 gap-6">
                    <div class="col-span-6 sm:col-span-4">
                      <label for="email_address" class="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autocomplete="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                      <label for="first_name" class="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        autocomplete="given-name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                      <label for="last_name" class="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        autocomplete="family-name"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label for="about" class="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div class="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows="1"
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="I'm a wonderful explorer."
                        value={about}
                        onChange={(e) => {
                          setAbout(e.target.value);
                        }}
                      ></textarea>
                    </div>
                    <p class="mt-2 text-sm text-gray-500">Brief description for your profile.</p>
                  </div>
                  <div className="mt-6">
                    <label class="block text-sm font-medium text-gray-700">Photo</label>
                    <div class="mt-2 flex items-center">
                      <span class="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                        {!photo && (
                          <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                        {photo && (
                          <img
                            className="shadow sm:w-24 sm:h-24 w-24 h-24 rounded-full"
                            src={displayPhoto}
                            alt="Avatar"
                          />
                        )}
                      </span>
                      <button
                        type="button"
                        class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                  {/* <div className="mt-6">
                    <label class="block text-sm font-medium text-gray-700">Profile photo</label>
                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div class="space-y-1 text-center">
                        <svg
                          class="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <div class="flex text-sm text-gray-600">
                          <label
                            for="file-upload"
                            class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                          </label>
                          <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-6">
          <p class="mt-1 text-sm text-gray-600">
            Want additional customization in your profile? Check out{" "}
            <Link href="https://skyprofile.hns.siasky.net/">SkyProfile</Link> made by community-member crypto_rocket.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
