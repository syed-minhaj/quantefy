"use client"
import { Table , TableBody, TableCell, TableHeader, TableRow } from "@/app/components/ui/table";
import Image from "next/image";
import { order , item } from "@/app/type";
import { useHash } from "@/app/hooks/hash";
import { getDateShort } from "@/app/utils/date";

type orderType = order & {item:item}
function OrderTable({orders}:{orders:orderType[]}) {
    const {hash , updateHash} = useHash("")
    return (
        <Table className="rounded-r1 bg-bg2 ">
            <TableHeader >
                <TableRow  >
                    <TableCell className="w-24 font-medium">Image</TableCell>
                    <TableCell className="w-36 font-medium">Name</TableCell>
                    <TableCell className="w-36 font-medium">Date</TableCell>
                    <TableCell className="w-24 font-medium">Price per unit</TableCell>
                    <TableCell className="w-24 font-medium">Cost per unit</TableCell>
                    <TableCell className="w-24 font-medium">Quantity</TableCell>
                    <TableCell className="w-24 font-medium">Total</TableCell>

                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order, index) => (
                    <TableRow key={index} onClick={() => updateHash(order.id)} >
                        <TableCell className="w-24">
                            <Image width={48} height={48} src={order.item.picture} alt="logo"
                            className="w-12 h-12 rounded-r1 bg-gray-200 object-contain border border-input" />
                        </TableCell>
                        <TableCell className="">
                            {order.item.name}
                        </TableCell>
                        <TableCell className="">
                            {getDateShort(new Date(order.created_at))}
                        </TableCell>
                        <TableCell className="">
                            {order.price_per_unit}
                        </TableCell>
                        <TableCell className="">
                            {order.cost_per_unit}
                        </TableCell>
                        <TableCell className="">
                            {order.quantity}
                        </TableCell>
                        <TableCell className="font-medium">
                            {order.price_per_unit * order.quantity}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default OrderTable;