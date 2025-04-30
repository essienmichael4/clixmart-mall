import { Search } from "lucide-react"
import { useState } from "react"
import AllProducts from "@/components/AllProducts"
import { useProductFilters } from "@/hooks/useProductFilters"
import { useQuery } from "@tanstack/react-query"
import useAxiosToken from "@/hooks/useAxiosToken"
import { ProductStats } from "@/lib/types"
// import CreateProductDialog from "./CreateProductDialog"

const Products = () => {
  const {status, review, setFilters} = useProductFilters()
  const [filtering, setFiltering] = useState("")
  const [timeFrame, setTimeFrame] = useState("DAY")
  const axios_instance_token = useAxiosToken()

  const  fetchProductStats = async () => {
    const products = await axios_instance_token.get(`/stats/admin/products?timeframe=${timeFrame}`).then(res => {
      console.log(res.data);
      
      return res.data
    })

    return products
  }

  const productsStatsQuery = useQuery<ProductStats>({
    queryKey: ["products", "stats", timeFrame],
    queryFn: async() => await fetchProductStats()
  })

  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="mt-6 flex items-center gap-2 justify-between">
          <h3 className="font-bold text-2xl text-nowrap">Products</h3>
          <div className="flex items-center gap-2">
            <button onClick={()=> setTimeFrame("DAY")} className={`${timeFrame === "DAY" ? 'border-blue-700 text-blue-700' : 'text-muted-foreground'} border rounded-full py-1 px-2 text-xs`}>Today</button>
            <button onClick={()=> setTimeFrame("MONTH")} className={`${timeFrame === "MONTH" ? 'border-blue-700 text-blue-700' : 'text-muted-foreground'} border rounded-full py-1 px-2 text-xs`}>This Month</button>
            <button onClick={()=> setTimeFrame("YEAR")} className={`${timeFrame === "YEAR" ? 'border-blue-700 text-blue-700' : 'text-muted-foreground'} border rounded-full py-1 px-2 text-xs`}>This Year</button>
          </div>
            {/* <CreateProductDialog store={store as string} trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Product</span>
              </button>
            }/> */}
        </div>
        <div className="w-full flex flex-wrap">
          <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
            <div className="border p-4 rounded-lg">
              <div>
                <h3 className="text-xs font-semibold">{ProductPeriodView(productsStatsQuery.data?.count.period as string)} Products</h3>
              </div>
              <div className="flex">
                <div>
                  <div className="flex gap-2 my-2 items-center">
                    <p className="text-lg">{productsStatsQuery.data?.count.products}</p>
                    {ProductCountStatView(productsStatsQuery.data?.count.statistics)}
                  </div>
                  {ProductComparisonView(productsStatsQuery.data?.count.period as string)}
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
            <div className="border p-4 rounded-lg">
              <div>
                <h3 className="text-xs font-semibold">Product Revenue</h3>
              </div>
              <div className="flex">
                <div>
                  <div className="flex gap-2 my-2 items-center">
                    <p className="text-lg">{productsStatsQuery.data?.revenue.revenue}</p>
                    {ProductPercentageStatView(productsStatsQuery.data?.revenue.statistics)}
                  </div>
                  {ProductComparisonView(productsStatsQuery.data?.revenue.period as string)}
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div className='w-full sm:w-1/2 lg:w-1/3 px-2 py-2'>
            <div className="border p-4 rounded-lg">
              <div>
                <h3 className="text-xs font-semibold">Product Sold</h3>
              </div>
              <div className="flex">
                <div>
                  <div className="flex gap-2 my-2 items-center">
                    <p className="text-lg">{productsStatsQuery.data?.sold.sold}</p>
                    {ProductPercentageStatView(productsStatsQuery.data?.sold.statistics)}
                  </div>
                  {ProductComparisonView(productsStatsQuery.data?.sold.period as string)}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
          
        <div className="mt-4 flex flex-wrap justify-between items-center">
              
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=> {setFilters({review: undefined, status: undefined})}} className={`${!status && !review && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>All</button>
            <div className="h-8 w-[1px] bg-gray-500"></div>
            <button  onClick={()=> {review === "PENDING" ? setFilters({review: undefined, status}) : setFilters({review: "PENDING", status})}} className={`${review === "PENDING" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Pending</button>
            <button  onClick={()=> {review === "APPROVED" ? setFilters({review: undefined, status}) : setFilters({review: "APPROVED", status})}} className={`${review === "APPROVED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Approved</button>
            <button  onClick={()=> {review === "REJECTED" ? setFilters({review: undefined, status}) : setFilters({review: "REJECTED", status})}} className={`${review === "REJECTED" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Rejected</button>
            <div className="h-8 w-[1px] bg-gray-500"></div>
            <button onClick={()=> {status === "DRAFT" ? setFilters({status: undefined, review}) : setFilters({status: "DRAFT", review})}} className={`${status === "DRAFT" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Draft</button>
            <button  onClick={()=> {status === "PUBLISH" ? setFilters({status: undefined, review}) : setFilters({status: "PUBLISH", review})}} className={`${status === "PUBLISH" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Published</button>
            <button  onClick={()=> {status === "ARCHIVE" ? setFilters({status: undefined, review}) : setFilters({status: "ARCHIVE", review})}} className={`${status === "ARCHIVE" && 'active bg-slate-400'} text-xs py-2 px-4 rounded-md`}>Archived</button>
          </div>

          <div className="w-full sm:w-[320px] mt-2 xl:mt-0">
            <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Plur 890987645368" onChange={e => setFiltering(e.target.value)} className="outline-none text-xs sm:text-sm w-full"/>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AllProducts status={status} review={review} filtering={filtering} />
        </div>
      </div>
    </>
  )
}

function ProductCountStatView(stat?:number){
  if(stat && stat < 0){
    return(
      <span className="text-xs p-1 border border-rose-700 text-rose-700 bg-rose-100 rounded-full">{stat} products</span>
    )
  }else if(stat && stat > 0){
    return(
      <span className="text-xs p-1 border border-emerald-700 text-emerald-700 bg-emerald-100 rounded-full"><span>+</span>{stat} products</span>
    )
  }else{
    return(
      <span className="text-xs p-1 border rounded-full">{stat} products</span>
    )
  }
}

function ProductPercentageStatView(stat?:number){
  if(stat && stat < 0){
    return(
      <span className="text-xs p-1 border border-rose-700 text-rose-700 bg-rose-100 rounded-full">{stat}%</span>
    )
  }else if(stat && stat > 0){
    return(
      <span className="text-xs p-1 border border-emerald-700 text-emerald-700 bg-emerald-100 rounded-full"><span>+</span>{stat}%</span>
    )
  }else{
    return(
      <span className="text-xs p-1 border rounded-full">{stat}%</span>
    )
  }
}

function ProductComparisonView(period:string){
  if(period === "DAY") return <p className="text-xs text-muted-foreground">Compared to yesterday</p>

  if(period === "WEEK") return <p className="text-xs text-muted-foreground">Compared to last week</p>

  if(period === "MONTH") return <p className="text-xs text-muted-foreground">Compared to previous month</p>

  if(period === "YEAR") return <p className="text-xs text-muted-foreground">Compared to previous year</p>
}

function ProductPeriodView(period:string){
  if(period === "DAY") return <span>Today's</span>

  if(period === "WEEK") return <span>Week's</span>

  if(period === "MONTH") return <span>Month's</span>

  if(period === "YEAR") return <span>Year's</span>
}

export default Products
