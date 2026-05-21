import { IconType } from "react-icons";
import { RiShoppingBasket2Line } from "react-icons/ri";

interface CategoriaCardProps {
    icon: IconType
    label: string
    bgColor: string
    iconColor: string
}

export default function CardCategoriaHome({ icon: Icon, label, bgColor, iconColor }: CategoriaCardProps) {
    return (
        <div className="">
           
            <div className="flex flex-col gap-2 mt-5 items-center justify-center h-35 border border-solid border-blue-200 rounded-lg px-27 py-6 w-full cursor-pointer">
                <div className={` ${bgColor} rounded-full p-4`}>
                    <Icon className={`${iconColor} text-2xl`}/>
                </div>
                <p className="font-bold text-center text-sm">{label}</p>
            </div>
        </div>
    )
}