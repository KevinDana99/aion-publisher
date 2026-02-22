'use client'

import { Suspense, useState, useRef } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, TextInput, NumberInput, Select, Textarea, Divider, Table, Badge, ActionIcon, Box, Modal, Grid, ThemeIcon } from '@mantine/core'
import { IoAdd, IoTrash, IoDownload, IoPrint, IoDocumentText, IoClose, IoCheckmark } from 'react-icons/io5'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

function InvoicerLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface Invoice {
  id: string
  number: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  notes: string
  status: 'pagada' | 'pendiente' | 'vencida'
}

const initialInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FAC-001',
    clientName: 'Cliente Alpha',
    clientEmail: 'alpha@email.com',
    clientPhone: '+52 555 123 4567',
    clientAddress: 'Av. Reforma 123, CDMX',
    date: '2026-02-20',
    dueDate: '2026-03-20',
    items: [
      { id: '1', description: 'Diseño de marca', quantity: 1, unitPrice: 1500 },
      { id: '2', description: 'Desarrollo web', quantity: 1, unitPrice: 1000 },
    ],
    notes: 'Gracias por su preferencia',
    status: 'pagada'
  },
  {
    id: '2',
    number: 'FAC-002',
    clientName: 'Beta Corp',
    clientEmail: 'beta@corp.com',
    clientPhone: '+52 555 987 6543',
    clientAddress: 'Blvd. Centro 456, Monterrey',
    date: '2026-02-18',
    dueDate: '2026-03-18',
    items: [
      { id: '1', description: 'Campaña publicitaria', quantity: 1, unitPrice: 4800 },
    ],
    notes: '',
    status: 'pendiente'
  },
]

function InvoicerContent() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [modalOpened, setModalOpened] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }]
  })

  const statusColors: Record<string, string> = {
    pagada: 'green',
    pendiente: 'yellow',
    vencida: 'red'
  }

  const calculateTotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const getNextInvoiceNumber = () => {
    const lastNumber = invoices.reduce((max, inv) => {
      const num = parseInt(inv.number.replace('FAC-', ''))
      return num > max ? num : max
    }, 0)
    return `FAC-${String(lastNumber + 1).padStart(3, '0')}`
  }

  const addItem = () => {
    const items = newInvoice.items || []
    setNewInvoice({
      ...newInvoice,
      items: [...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  const removeItem = (id: string) => {
    const items = (newInvoice.items || []).filter(item => item.id !== id)
    setNewInvoice({ ...newInvoice, items })
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const items = (newInvoice.items || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
    setNewInvoice({ ...newInvoice, items })
  }

  const createInvoice = () => {
    const invoice: Invoice = {
      id: Date.now().toString(),
      number: getNextInvoiceNumber(),
      clientName: newInvoice.clientName || '',
      clientEmail: newInvoice.clientEmail || '',
      clientPhone: newInvoice.clientPhone || '',
      clientAddress: newInvoice.clientAddress || '',
      date: newInvoice.date || new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate || '',
      items: newInvoice.items || [],
      notes: newInvoice.notes || '',
      status: 'pendiente'
    }
    setInvoices([invoice, ...invoices])
    setModalOpened(false)
    setNewInvoice({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      notes: '',
      items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id))
  }

  const updateStatus = (id: string, status: 'pagada' | 'pendiente' | 'vencida') => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status } : inv))
  }

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF()
    const total = calculateTotal(invoice.items)
    const iva = total * 0.16
    const grandTotal = total + iva

    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246)
    doc.text('FACTURA', 105, 25, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(invoice.number, 105, 35, { align: 'center' })

    doc.setDrawColor(200, 200, 200)
    doc.line(20, 45, 190, 45)

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.text('DE:', 20, 55)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Aion Publisher', 20, 62)
    doc.text('contacto@aionpublisher.com', 20, 68)

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.text('PARA:', 110, 55)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(invoice.clientName, 110, 62)
    doc.text(invoice.clientEmail, 110, 68)
    doc.text(invoice.clientPhone, 110, 74)
    doc.text(invoice.clientAddress, 110, 80, { maxWidth: 80 })

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(10)
    doc.text(`Fecha: ${invoice.date}`, 20, 95)
    doc.text(`Vencimiento: ${invoice.dueDate}`, 20, 101)

    const tableData = invoice.items.map(item => [
      item.description,
      item.quantity.toString(),
      `$${item.unitPrice.toLocaleString()}`,
      `$${(item.quantity * item.unitPrice).toLocaleString()}`
    ])

    autoTable(doc, {
      startY: 110,
      head: [['Descripción', 'Cantidad', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      }
    })

    const finalY = (doc as any).lastAutoTable.finalY + 10
    
    doc.setFontSize(10)
    doc.text(`Subtotal: $${total.toLocaleString()}`, 140, finalY, { align: 'right' })
    doc.text(`IVA (16%): $${iva.toLocaleString()}`, 140, finalY + 7, { align: 'right' })
    doc.setFontSize(12)
    doc.setTextColor(59, 130, 246)
    doc.text(`TOTAL: $${grandTotal.toLocaleString()}`, 140, finalY + 16, { align: 'right' })

    if (invoice.notes) {
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(9)
      doc.text('Notas:', 20, finalY + 30)
      doc.text(invoice.notes, 20, finalY + 36, { maxWidth: 170 })
    }

    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Gracias por su preferencia', 105, 280, { align: 'center' })

    doc.save(`${invoice.number}.pdf`)
  }

  const printInvoice = (invoice: Invoice) => {
    generatePDF(invoice)
    setTimeout(() => {
      window.open(`/${invoice.number}.pdf`, '_blank')
    }, 500)
  }

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || filterStatus === 'Todos' || inv.status === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoDocumentText size={28} />
            <Title order={2}>Facturador</Title>
          </Group>
          <Button leftSection={<IoAdd size={18} />} onClick={() => setModalOpened(true)}>
            Nueva Factura
          </Button>
        </Group>

        <Paper shadow="xs" p="md" radius="md">
          <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
            <TextInput 
              label="Buscar" 
              placeholder="Buscar factura..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select 
              label="Estado" 
              placeholder="Todos" 
              data={['Todos', 'Pagada', 'Pendiente', 'Vencida']}
              value={filterStatus}
              onChange={setFilterStatus}
            />
            <Box />
            <Box />
          </SimpleGrid>
        </Paper>

        <Paper shadow="xs" radius="md">
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nº Factura</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Vencimiento</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredInvoices.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">No hay facturas</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const total = calculateTotal(invoice.items) * 1.16
                  return (
                    <Table.Tr key={invoice.id}>
                      <Table.Td><Text fw={500}>{invoice.number}</Text></Table.Td>
                      <Table.Td>
                        <Box>
                          <Text>{invoice.clientName}</Text>
                          <Text size="xs" c="dimmed">{invoice.clientEmail}</Text>
                        </Box>
                      </Table.Td>
                      <Table.Td>{invoice.date}</Table.Td>
                      <Table.Td>{invoice.dueDate}</Table.Td>
                      <Table.Td>${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Table.Td>
                      <Table.Td>
                        <Badge color={statusColors[invoice.status]} variant="light">
                          {invoice.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon 
                            variant="subtle" 
                            color="blue"
                            onClick={() => generatePDF(invoice)}
                            title="Descargar PDF"
                          >
                            <IoDownload size={18} />
                          </ActionIcon>
                          <ActionIcon 
                            variant="subtle" 
                            color="gray"
                            onClick={() => printInvoice(invoice)}
                            title="Imprimir"
                          >
                            <IoPrint size={18} />
                          </ActionIcon>
                          <ActionIcon 
                            variant="subtle" 
                            color="green"
                            onClick={() => updateStatus(invoice.id, 'pagada')}
                            title="Marcar como pagada"
                          >
                            <IoCheckmark size={18} />
                          </ActionIcon>
                          <ActionIcon 
                            variant="subtle" 
                            color="red"
                            onClick={() => deleteInvoice(invoice.id)}
                            title="Eliminar"
                          >
                            <IoTrash size={18} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  )
                })
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={600} size="lg">Nueva Factura</Text>}
        size="xl"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">Completa la información para crear una nueva factura</Text>
          
          <Divider label="Información del Cliente" labelPosition="left" />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput 
              label="Nombre del cliente" 
              placeholder="Empresa o persona"
              value={newInvoice.clientName || ''}
              onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
              required
            />
            <TextInput 
              label="Email" 
              placeholder="cliente@email.com"
              value={newInvoice.clientEmail || ''}
              onChange={(e) => setNewInvoice({ ...newInvoice, clientEmail: e.target.value })}
            />
            <TextInput 
              label="Teléfono" 
              placeholder="+52 000 000 0000"
              value={newInvoice.clientPhone || ''}
              onChange={(e) => setNewInvoice({ ...newInvoice, clientPhone: e.target.value })}
            />
            <TextInput 
              label="Dirección" 
              placeholder="Dirección fiscal"
              value={newInvoice.clientAddress || ''}
              onChange={(e) => setNewInvoice({ ...newInvoice, clientAddress: e.target.value })}
            />
          </SimpleGrid>

          <Divider label="Fechas" labelPosition="left" />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput 
              label="Fecha de emisión" 
              type="date"
              value={newInvoice.date || ''}
              onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
            />
            <TextInput 
              label="Fecha de vencimiento" 
              type="date"
              value={newInvoice.dueDate || ''}
              onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
            />
          </SimpleGrid>

          <Divider label="Conceptos" labelPosition="left" />
          <Stack gap="xs">
            {(newInvoice.items || []).map((item, index) => (
              <Group key={item.id} align="flex-end" gap="sm">
                <TextInput
                  style={{ flex: 2 }}
                  placeholder="Descripción del servicio"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
                <NumberInput
                  style={{ width: 100 }}
                  label={index === 0 ? 'Cantidad' : undefined}
                  value={item.quantity}
                  onChange={(value) => updateItem(item.id, 'quantity', Number(value))}
                  min={1}
                />
                <NumberInput
                  style={{ width: 150 }}
                  label={index === 0 ? 'Precio unit.' : undefined}
                  value={item.unitPrice}
                  onChange={(value) => updateItem(item.id, 'unitPrice', Number(value))}
                  prefix="$"
                  min={0}
                />
                <NumberInput
                  style={{ width: 150 }}
                  label={index === 0 ? 'Subtotal' : undefined}
                  value={item.quantity * item.unitPrice}
                  prefix="$"
                  disabled
                />
                {(newInvoice.items || []).length > 1 && (
                  <ActionIcon color="red" variant="subtle" onClick={() => removeItem(item.id)}>
                    <IoTrash size={18} />
                  </ActionIcon>
                )}
              </Group>
            ))}
            <Button variant="light" leftSection={<IoAdd size={16} />} onClick={addItem} size="sm">
              Agregar concepto
            </Button>
          </Stack>

          <Textarea
            label="Notas"
            placeholder="Notas adicionales para el cliente..."
            value={newInvoice.notes || ''}
            onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
            rows={2}
          />

          <Paper p="md" radius="md" style={{ background: 'var(--mantine-color-gray-0)' }}>
            <SimpleGrid cols={3}>
              <Box>
                <Text size="sm" c="dimmed">Subtotal</Text>
                <Text fw={600}>${calculateTotal(newInvoice.items || []).toLocaleString()}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">IVA (16%)</Text>
                <Text fw={600}>${(calculateTotal(newInvoice.items || []) * 0.16).toLocaleString()}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Total</Text>
                <Text fw={700} size="lg" c="blue">
                  ${((calculateTotal(newInvoice.items || []) * 1.16)).toLocaleString()}
                </Text>
              </Box>
            </SimpleGrid>
          </Paper>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={createInvoice}
              disabled={!newInvoice.clientName || !newInvoice.items?.some(i => i.description)}
            >
              Crear Factura
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  )
}

export default function InvoicerPage() {
  return (
    <Suspense fallback={<InvoicerLoader />}>
      <InvoicerContent />
    </Suspense>
  )
}