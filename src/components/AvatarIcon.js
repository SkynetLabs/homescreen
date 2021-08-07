import { UserCircleIcon, DesktopComputerIcon } from "@heroicons/react/solid";

const AvatarIcon = ({ avatar, skapp }) => {
  return (
    <>
      {/* {avatar && (
        <div className="flex justify-center mt-4">
          <img className="shadow sm:w-16 sm:h-16 w-16 h-16 rounded-full" src={avatar} alt="Avatar" />
        </div>
      )} */}
      {!avatar && !skapp && <UserCircleIcon className="w-16 h-16 text-gray-200" />}
      {avatar && (
        <div className="sm:w-16 sm:h-16 w-16 h-16 ">
          <img className="shadow rounded-full object-cover h-full w-full" src={avatar} alt="Avatar" />
        </div>
      )}
      {!avatar && skapp && <DesktopComputerIcon className="w-16 h-16 text-gray-200" />}
      {/* {avatar && skapp && (
        <div className="sm:w-16 sm:h-16 w-16 h-16 ">
          <img className="object-cover h-full" src={avatar} alt="Avatar" />
        </div>
      )} */}
    </>
  );
};

export default AvatarIcon;
