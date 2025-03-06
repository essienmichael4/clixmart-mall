import { useState } from 'react'
import logo from '@/assets/logo.png'
import { Bell, ChevronDown, ChevronRight, LogOut, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ScrollArea } from './ui/scroll-area'
import useCategories from '@/hooks/useCategories'
import { Separator } from './ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import useAuth from '@/hooks/useAuth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import useCart from '@/hooks/useCart'

const Header = () => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    const {auth, dispatch} = useAuth()
    const searchIinput = useLocation()
    const [active, setActive] = useState<number[]>([])
    const [search, setSearch] = useState(searchIinput?.search?.split("=")[1])
    const navigate = useNavigate()
    const {categories} = useCategories()
    const {cartItemsCount} = useCart()

    const toggleNavbar = ()=>{
        setMobileDrawerOpen(!mobileDrawerOpen)
    }

    const handleToggleActive = (value:number)=>{
        if(active?.includes(value)){
            setActive(active.filter(num=>num!=value))
        }else{
            
            setActive(prev=> [...prev, value])
        }
    }

    const handleSearch = ()=>{
        if(search) {
            navigate(`/products?q=${search}`)
        }else{
            navigate(`/products`)
        }
      }

    return (
        <>
            <nav className="sticky top-0 z-20 py-3 backdrop-blur-lg border-b border-neutral-100/80">
            <div className="container relative px-4 mx-auto text-sm">
                <div className="flex justify-between items-center">
                    <div className='flex items-center gap-2'>
                        <div className="lg:hidden md:flex flex-col justify-end pt-1">
                            <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X className='w-4 h-4  md:w-6 md:h-6'/> : <Menu className='w-4 h-4 md:w-6 md:h-6'/>}</button>
                        </div>
                        <Link to={"/"} className="flex items-center flex-shrink-0">
                            <img src={logo} alt="logo" className='h-5 w-5 md:h-10 md:w-10 mr-2' />
                            <span className="text-sm md:text-xl tracking-tight">CLIXMART MALL</span>
                        </Link>
                    </div>
                    {/* <div> */}
                    <div className="hidden w-full rounded-md md:flex justify-center items-center h-10">
                        <div className="flex w-full sm:w-2/3 md:w-2/4 border h-full items-center px-3 gap-3 rounded-s-md bg-white focus-within:border-gray-500">
                            <Search className="h-4 w-4 text-gray-400 pointer-events-none" />
                            <input type="text" onChange={(e)=>setSearch(e.target.value)}
                                value={search} placeholder="Search products, categories & brands" className="outline-none w-full bg-transparent"/>
                        </div>
                        <button className="text-white bg-blue-700 h-full px-6 rounded-e-md hover:bg-blue-500" onClick={handleSearch}>Search</button>
                    </div>
                    {/* </div> */}
                    <div className="flex justify-center items-center space-x-1">
                        <Link to={"../cart"} className='p-2 relative bg-gray-100 hover:bg-gray-200 rounded-full'>
                            <ShoppingCart className='w-4 h-4 text-gray-500'/>
                            {cartItemsCount > 0 && <div className='w-4 h-4 absolute -top-0 right-0 text-[.6rem] text-white flex items-center justify-center bg-blue-500 rounded-full'>{cartItemsCount}</div>}
                        </Link>
                        {auth?.id ? <>
                            <button className='p-2 relative bg-gray-100 hover:bg-gray-200 rounded-full'>
                                <Bell className='w-4 h-4 text-gray-500'/>
                                <div className='w-4 h-4 absolute top-0 right-0 text-[.6rem] text-white flex items-center justify-center bg-rose-500 rounded-full'>2</div>
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className='w-10 h-10 rounded-full'><User className="h-6 w-6 text-muted-foreground" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={()=>{navigate(`../users/${auth!.id}`)}}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>{
                                        dispatch({type: "REMOVE_AUTH", payload: undefined})
                                    }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            
                        </> :
                        <Link to={"login"} className="py-2 px-3 rounded-md text-sm uppercase text-gray-500" >Login</Link>
                        }
                    </div>
                    {/* <div className="lg:hidden md:flex flex-col justify-end"> */}
                        {/* <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X /> : <Menu />}</button> */}
                    {/* </div> */}
                </div>
            </div>

            </nav>
            {mobileDrawerOpen && 
                <div className="fixed inset-0 z-30 w-full bg-gray-700/10 backdrop-blur-lg flex flex-col lg:hidden">
                    <ScrollArea className='w-[300px] h-full bg-white pt-4'>
                        <div className='flex items-center gap-2 pl-4 mb-4'>
                            <div className="lg:hidden md:flex flex-col justify-end pt-1">
                                <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X className='w-4 h-4  md:w-5 md:h-5'/> : <Menu className='w-4 h-4 md:w-5 md:h-5'/>}</button>
                            </div>
                            <Link to={"/"} className="flex items-center flex-shrink-0">
                                <img src={logo} alt="logo" className='h-5 w-5 md:h-10 md:w-10 mr-2' />
                                <span className="text-sm md:text-xl tracking-tight">CLIXMART MALL</span>
                            </Link>
                        </div>
                        <Separator/>
                        <h2 className="uppercase px-4 text-xs font-semibold my-4">Our Categories</h2>
                        {
                            categories?.map(category=>{
                                return <Collapsible className='px-4 py-1' onClick={()=>handleToggleActive(category.id)} key={category.id}>
                                    <CollapsibleTrigger  >
                                        <div className={`flex items-center gap-3 pl-2 text-nowrap text-start uppercase`}>
                                            {active?.includes(category.id) ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/> }  <span className='text-sm'>{category.name}</span>
                                        </div>
                                    </CollapsibleTrigger>
                                        <CollapsibleContent className={` pl-10 bg-slate-50`}>
                                            {category.subCategories?.map(sub=>{
                                                return <div className="text-xs capitalize py-1 text-nowrap" key={sub.id}>
                                                    {sub.name}
                                                </div>
                                            })}
                                        </CollapsibleContent>
                                </Collapsible>
                            })
                        }
                        {/* <div className="flex flex-col gap-6 mt-2">
                            <a href="https://forms.gle/cMHhPURSKERJ2BhM6" onClick={toggleNavbar} target="_blank" className="text-center py-2 px-3 rounded-md text-blue-700 border border-blue-700" >Register</a>
                        </div> */}
                    </ScrollArea>
                </div>
            }
        </>
    )
}

export default Header
