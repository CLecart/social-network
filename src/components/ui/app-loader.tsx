import Image from "next/image";

export default function AppLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--bgLevel3) p-0 m-0">
            <Image
                src="/konekt-logo-full.png"
                alt="loading..."
                width={445}
                height={103}
                className="animate-bounce w-32 h-auto"
                priority
            />
        </div>
    );
}