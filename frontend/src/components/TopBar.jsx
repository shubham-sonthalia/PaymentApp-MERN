export const TopBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="flex flex-wrap items-center justify-between mx-auto p-4 shadow-md">
      <div className="font-bold text-xl">Payments App</div>
      <div className="flex">
        <div className="text-xl">
          Hello {user.firstName != "" ? user.firstName.toUpperCase() : ""},{" "}
        </div>
        <div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {user.firstName != ""
              ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};
