import GenerateReport from "./components/generate";

export default async function Report({params}:{params:any}) {
    const { id } = await params;
    return (
        <div className="flex flex-col gap-4 w-full px-4 overflow-x-hidden">
            <div className="flex flex-row items-center ">
                <h1 className="text-xl font-semibold">Report</h1>
            </div>
            <GenerateReport storeId={id} />
        </div>
    )
}