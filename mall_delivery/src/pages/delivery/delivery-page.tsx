import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Delivery {
  id: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  status: string
  trackingStatus: string
  progress: number
  date: string
  items: { name: string; quantity: number; price: number }[]
}

const initialDeliveries: Delivery[] = [
  {
    id: "ORD-001",
    customerName: "Alice Smith",
    customerPhone: "555-123-4567",
    deliveryAddress: "123 Main St, New York, NY",
    status: "In Transit",
    trackingStatus: "Out for Delivery",
    progress: 65,
    date: "2024-01-15",
    items: [{ name: "Laptop", quantity: 1, price: 1200 }],
  },
  {
    id: "ORD-002",
    customerName: "Bob Johnson",
    customerPhone: "555-987-6543",
    deliveryAddress: "456 Oak Ave, Los Angeles, CA",
    status: "Delivered",
    trackingStatus: "Delivered",
    progress: 100,
    date: "2024-01-14",
    items: [{ name: "Mouse", quantity: 2, price: 25 }],
  },
  {
    id: "ORD-003",
    customerName: "Charlie Brown",
    customerPhone: "555-555-1212",
    deliveryAddress: "789 Pine Ln, Chicago, IL",
    status: "Processing",
    trackingStatus: "Processing",
    progress: 20,
    date: "2024-01-15",
    items: [{ name: "Keyboard", quantity: 1, price: 75 }],
  },
  {
    id: "ORD-004",
    customerName: "Diana Prince",
    customerPhone: "555-111-2222",
    deliveryAddress: "101 River Rd, Houston, TX",
    status: "In Transit",
    trackingStatus: "In Transit",
    progress: 45,
    date: "2024-01-13",
    items: [{ name: "Monitor", quantity: 1, price: 300 }],
  },
  {
    id: "ORD-005",
    customerName: "Eve Adams",
    customerPhone: "555-333-4444",
    deliveryAddress: "202 Mountain View, Phoenix, AZ",
    status: "Pending",
    trackingStatus: "Pending",
    progress: 0,
    date: "2024-01-16",
    items: [{ name: "Webcam", quantity: 1, price: 50 }],
  },
]

const statusColors: Record<string, string> = {
  Delivered: "bg-green-500/20 text-green-400",
  "In Transit": "bg-primary/20 text-primary",
  Processing: "bg-amber-500/20 text-amber-400",
  Pending: "bg-gray-500/20 text-gray-400",
  "Out for Delivery": "bg-blue-500/20 text-blue-400",
  Failed: "bg-red-500/20 text-red-400",
  Returned: "bg-purple-500/20 text-purple-400",
}

export function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // You can adjust this value

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setShowDetailsDialog(true)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      )
    )
  }

  const handleTrackingChange = (id: string, newTrackingStatus: string) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, trackingStatus: newTrackingStatus } : delivery
      )
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(deliveries.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDeliveries = deliveries.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{deliveries.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {deliveries.filter((d) => d.status === "In Transit").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {deliveries.filter((d) => d.status === "Delivered").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {deliveries.filter((d) => d.status === "Pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orders ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Customer Phone Number</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>View Details</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Delivery Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.customerName}</TableCell>
                    <TableCell>{delivery.customerPhone}</TableCell>
                    <TableCell>{delivery.deliveryAddress}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(delivery)}>
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={delivery.trackingStatus}
                        onValueChange={(value) => handleTrackingChange(delivery.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Tracking Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Transit">In Transit</SelectItem>
                          <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                          <SelectItem value="Returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={delivery.status}
                        onValueChange={(value) => handleStatusChange(delivery.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Delivery Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Transit">In Transit</SelectItem>
                          <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                          <SelectItem value="Returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected order.
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground col-span-1">Order ID:</p>
                <p className="col-span-3">{selectedDelivery.id}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground col-span-1">Customer:</p>
                <p className="col-span-3">{selectedDelivery.customerName}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground col-span-1">Phone:</p>
                <p className="col-span-3">{selectedDelivery.customerPhone}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground col-span-1">Address:</p>
                <p className="col-span-3">{selectedDelivery.deliveryAddress}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground col-span-1">Status:</p>
                <Badge className={statusColors[selectedDelivery.status]}>{selectedDelivery.status}</Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground col-span-1">Tracking:</p>
                <Badge className={statusColors[selectedDelivery.trackingStatus]}>{selectedDelivery.trackingStatus}</Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground col-span-1">Items:</p>
                <div className="col-span-3">
                  {selectedDelivery.items.map((item, index) => (
                    <p key={index} className="text-sm">
                      {item.name} (x{item.quantity}) - ${item.price} each
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
