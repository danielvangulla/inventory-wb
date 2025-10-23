// import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-md">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <img className="fill-current bg-white text-white dark:text-black rounded-xl" src='/images/logo3-hd.png' />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">PARAGON SQUARE <br />
                    <span className="text-red-500">FOOD COURT</span>
                </span>
            </div>
        </>
    );
}
