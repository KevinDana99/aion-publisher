'use client'

import { Suspense, useState } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, TextInput, NumberInput, Select, Textarea, Divider, Table, Badge, ActionIcon, Box, Modal, ThemeIcon } from '@mantine/core'
import { IoWallet, IoAdd, IoTrash, IoDownload, IoPrint, IoDocumentText, IoCalculator, IoCalendar } from 'react-icons/io5'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

function BudgeterLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

interface BudgetItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  category: string
}

interface Budget {
  id: string
  number: string
  title: string
  clientName: string
  clientEmail: string
  clientCompany: string
  projectDescription: string
  items: BudgetItem[]
  validUntil: string
  notes: string
  discount: number
  status: 'pendiente' | 'aprobado' | 'rechazado'
  createdAt: string
}

const initialBudgets: Budget[] = [
  {
    id: '1',
    number: 'PRES-001',
    title: 'Desarrollo E-commerce',
    clientName: 'Cliente Alpha',
    clientEmail: 'alpha@empresa.com',
    clientCompany: 'Alpha Corp',
    projectDescription: 'Desarrollo de tienda online con pasarela de pagos y panel de administración.',
    items: [
      { id: '1', description: 'Diseño UX/UI', quantity: 1, unitPrice: 3500, category: 'Diseño' },
      { id: '2', description: 'Desarrollo Frontend', quantity: 80, unitPrice: 50, category: 'Desarrollo' },
      { id: '3', description: 'Desarrollo Backend', quantity: 60, unitPrice: 60, category: 'Desarrollo' },
      { id: '4', description: 'Integración pagos', quantity: 1, unitPrice: 800, category: 'Integración' },
    ],
    validUntil: '2026-03-15',
    notes: 'Incluye 3 meses de soporte gratuito',
    discount: 5,
    status: 'pendiente',
    createdAt: '2026-02-20'
  },
  {
    id: '2',
    number: 'PRES-002',
    title: 'App Miliar',
    clientName: 'Beta Startups',
    clientEmail: 'contacto@beta.mx',
    clientCompany: 'Beta Startups S.A.',
    projectDescription: 'Aplicación móvil multiplataforma para gestión de tareas.',
    items: [
      { id: '1', description: 'Diseño de interfaz', quantity: 1, unitPrice: 4500, category: 'Diseño' },
      { id: '2', description: 'Desarrollo App', quantity: 120, unitPrice: 55, category: 'Desarrollo' },
      { id: '3', description: 'Backend + API', quantity: 40, unitPrice: 65, category: 'Desarrollo' },
    ],
    validUntil: '2026-03-01',
    notes: '',
    discount: 0,
    status: 'aprobado',
    createdAt: '2026-02-18'
  },
]

const categoryOptions = [
  'Diseño',
  'Desarrollo',
  'Integración',
  'Consultoría',
  'Soporte',
  'Hosting',
  'Marketing',
  'Otro'
]

function BudgeterContent() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [modalOpened, setModalOpened] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const [newBudget, setNewBudget] = useState<Partial<Budget>>({
    title: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    projectDescription: '',
    items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, category: 'Desarrollo' }],
    validUntil: '',
    notes: '',
    discount: 0
  })

  const statusColors: Record<string, string> = {
    pendiente: 'yellow',
    aprobado: 'green',
    rechazado: 'red'
  }

  const calculateSubtotal = (items: BudgetItem[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const calculateTotal = (items: BudgetItem[], discount: number) => {
    const subtotal = calculateSubtotal(items)
    const discountAmount = subtotal * (discount / 100)
    return subtotal - discountAmount
  }

  const getNextBudgetNumber = () => {
    const lastNumber = budgets.reduce((max, b) => {
      const num = parseInt(b.number.replace('PRES-', ''))
      return num > max ? num : max
    }, 0)
    return `PRES-${String(lastNumber + 1).padStart(3, '0')}`
  }

  const addItem = () => {
    const items = newBudget.items || []
    setNewBudget({
      ...newBudget,
      items: [...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, category: 'Desarrollo' }]
    })
  }

  const removeItem = (id: string) => {
    const items = (newBudget.items || []).filter(item => item.id !== id)
    setNewBudget({ ...newBudget, items })
  }

  const updateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    const items = (newBudget.items || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
    setNewBudget({ ...newBudget, items })
  }

  const createBudget = () => {
    const budget: Budget = {
      id: Date.now().toString(),
      number: getNextBudgetNumber(),
      title: newBudget.title || '',
      clientName: newBudget.clientName || '',
      clientEmail: newBudget.clientEmail || '',
      clientCompany: newBudget.clientCompany || '',
      projectDescription: newBudget.projectDescription || '',
      items: newBudget.items || [],
      validUntil: newBudget.validUntil || '',
      notes: newBudget.notes || '',
      discount: newBudget.discount || 0,
      status: 'pendiente',
      createdAt: new Date().toISOString().split('T')[0]
    }
    setBudgets([budget, ...budgets])
    setModalOpened(false)
    setNewBudget({
      title: '',
      clientName: '',
      clientEmail: '',
      clientCompany: '',
      projectDescription: '',
      items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, category: 'Desarrollo' }],
      validUntil: '',
      notes: '',
      discount: 0
    })
  }

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id))
  }

  const updateStatus = (id: string, status: 'pendiente' | 'aprobado' | 'rechazado') => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, status } : b))
  }

  const generatePDF = (budget: Budget) => {
    const doc = new jsPDF()
    const subtotal = calculateSubtotal(budget.items)
    const discountAmount = subtotal * (budget.discount / 100)
    const total = calculateTotal(budget.items, budget.discount)

    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246)
    doc.text('PRESUPUESTO', 105, 25, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(budget.number, 105, 35, { align: 'center' })

    doc.setDrawColor(200, 200, 200)
    doc.line(20, 45, 190, 45)

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(14)
    doc.text(budget.title, 20, 55)

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Fecha: ${budget.createdAt}`, 20, 65)
    doc.text(`Válido hasta: ${budget.validUntil}`, 20, 72)

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.text('CLIENTE:', 20, 85)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(budget.clientName, 20, 92)
    if (budget.clientCompany) doc.text(budget.clientCompany, 20, 99)
    doc.text(budget.clientEmail, 20, budget.clientCompany ? 106 : 99)

    let yPos = budget.clientCompany ? 120 : 113

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.text('DESCRIPCIÓN DEL PROYECTO', 20, yPos)
    
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    const descLines = doc.splitTextToSize(budget.projectDescription, 170)
    doc.text(descLines, 20, yPos + 10)
    yPos += 10 + (descLines.length * 6) + 10

    const tableData = budget.items.map(item => [
      item.description,
      item.category,
      item.quantity.toString(),
      `$${item.unitPrice.toLocaleString()}`,
      `$${(item.quantity * item.unitPrice).toLocaleString()}`
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Descripción', 'Categoría', 'Cantidad', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      }
    })

    const finalY = (doc as any).lastAutoTable.finalY + 10
    
    doc.setFontSize(10)
    doc.text(`Subtotal: $${subtotal.toLocaleString()}`, 140, finalY, { align: 'right' })
    
    if (budget.discount > 0) {
      doc.setTextColor(220, 53, 69)
      doc.text(`Descuento (${budget.discount}%): -$${discountAmount.toLocaleString()}`, 140, finalY + 7, { align: 'right' })
    }
    
    doc.setFontSize(12)
    doc.setTextColor(59, 130, 246)
    doc.text(`TOTAL: $${total.toLocaleString()}`, 140, finalY + 16, { align: 'right' })

    if (budget.notes) {
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(9)
      doc.text('Notas:', 20, finalY + 30)
      doc.text(budget.notes, 20, finalY + 36, { maxWidth: 170 })
    }

    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Este presupuesto es válido hasta la fecha indicada.', 105, 280, { align: 'center' })

    doc.save(`${budget.number}.pdf`)
  }

  const filteredBudgets = budgets.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || filterStatus === 'Todos' || b.status === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const pendingCount = budgets.filter(b => b.status === 'pendiente').length
  const approvedCount = budgets.filter(b => b.status === 'aprobado').length
  const totalValue = budgets.reduce((sum, b) => sum + calculateTotal(b.items, b.discount), 0)

  return (
    <Box style={{ width: '100%' }}>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoCalculator size={28} />
            <Title order={2}>Presupuestador</Title>
          </Group>
          <Button leftSection={<IoAdd size={18} />} onClick={() => setModalOpened(true)}>
            Nuevo Presupuesto
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="lg">
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Total Presupuestos</Text>
              <ThemeIcon variant="light" color="blue"><IoWallet size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{budgets.length}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Pendientes</Text>
              <ThemeIcon variant="light" color="yellow"><IoCalendar size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{pendingCount}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Aprobados</Text>
              <ThemeIcon variant="light" color="green"><IoDocumentText size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{approvedCount}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Valor Total</Text>
              <ThemeIcon variant="light" color="violet"><IoCalculator size={18} /></ThemeIcon>
            </Group>
            <Text size="lg" fw={700}>${totalValue.toLocaleString()}</Text>
          </Paper>
        </SimpleGrid>

        <Paper shadow="xs" p="md" radius="md">
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <TextInput 
              label="Buscar" 
              placeholder="Buscar presupuesto..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select 
              label="Estado" 
              placeholder="Todos" 
              data={['Todos', 'Pendiente', 'Aprobado', 'Rechazado']}
              value={filterStatus}
              onChange={setFilterStatus}
            />
          </SimpleGrid>
        </Paper>

        <Paper shadow="xs" radius="md">
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nº Presupuesto</Table.Th>
                <Table.Th>Título</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Válido hasta</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredBudgets.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">No hay presupuestos</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredBudgets.map((budget) => {
                  const total = calculateTotal(budget.items, budget.discount)
                  return (
                    <Table.Tr key={budget.id}>
                      <Table.Td><Text fw={500}>{budget.number}</Text></Table.Td>
                      <Table.Td>
                        <Box>
                          <Text fw={500}>{budget.title}</Text>
                          <Text size="xs" c="dimmed">{budget.projectDescription.substring(0, 50)}...</Text>
                        </Box>
                      </Table.Td>
                      <Table.Td>
                        <Box>
                          <Text>{budget.clientName}</Text>
                          <Text size="xs" c="dimmed">{budget.clientCompany}</Text>
                        </Box>
                      </Table.Td>
                      <Table.Td><Text fw={600}>${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text></Table.Td>
                      <Table.Td>
                        <Badge color={statusColors[budget.status]} variant="light">
                          {budget.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{budget.validUntil}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon 
                            variant="subtle" 
                            color="blue"
                            onClick={() => generatePDF(budget)}
                            title="Descargar PDF"
                          >
                            <IoDownload size={18} />
                          </ActionIcon>
                          {budget.status === 'pendiente' && (
                            <>
                              <ActionIcon 
                                variant="subtle" 
                                color="green"
                                onClick={() => updateStatus(budget.id, 'aprobado')}
                                title="Marcar como aprobado"
                              >
                                <IoDocumentText size={18} />
                              </ActionIcon>
                              <ActionIcon 
                                variant="subtle" 
                                color="red"
                                onClick={() => updateStatus(budget.id, 'rechazado')}
                                title="Marcar como rechazado"
                              >
                                <IoTrash size={18} />
                              </ActionIcon>
                            </>
                          )}
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
        title={<Text fw={600} size="lg">Nuevo Presupuesto</Text>}
        size="xl"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">Crea un presupuesto detallado para tu cliente</Text>
          
          <Divider label="Información del Cliente" labelPosition="left" />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput 
              label="Nombre del cliente" 
              placeholder="Nombre del contacto"
              value={newBudget.clientName || ''}
              onChange={(e) => setNewBudget({ ...newBudget, clientName: e.target.value })}
              required
            />
            <TextInput 
              label="Empresa" 
              placeholder="Nombre de la empresa"
              value={newBudget.clientCompany || ''}
              onChange={(e) => setNewBudget({ ...newBudget, clientCompany: e.target.value })}
            />
            <TextInput 
              label="Email" 
              placeholder="cliente@email.com"
              type="email"
              value={newBudget.clientEmail || ''}
              onChange={(e) => setNewBudget({ ...newBudget, clientEmail: e.target.value })}
              required
            />
            <TextInput 
              label="Válido hasta" 
              type="date"
              value={newBudget.validUntil || ''}
              onChange={(e) => setNewBudget({ ...newBudget, validUntil: e.target.value })}
              required
            />
          </SimpleGrid>

          <Divider label="Proyecto" labelPosition="left" />
          <TextInput 
            label="Título del presupuesto" 
            placeholder="Ej: Desarrollo E-commerce"
            value={newBudget.title || ''}
            onChange={(e) => setNewBudget({ ...newBudget, title: e.target.value })}
            required
          />
          <Textarea
            label="Descripción del proyecto"
            placeholder="Describe brevemente el alcance del proyecto..."
            value={newBudget.projectDescription || ''}
            onChange={(e) => setNewBudget({ ...newBudget, projectDescription: e.target.value })}
            rows={3}
            required
          />

          <Divider label="Conceptos" labelPosition="left" />
          <Stack gap="xs">
            {(newBudget.items || []).map((item, index) => (
              <Group key={item.id} align="flex-end" gap="sm">
                <TextInput
                  style={{ flex: 2 }}
                  placeholder="Descripción del servicio"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
                <Select
                  style={{ width: 120 }}
                  placeholder="Categoría"
                  data={categoryOptions}
                  value={item.category}
                  onChange={(value) => updateItem(item.id, 'category', value || 'Desarrollo')}
                />
                <NumberInput
                  style={{ width: 80 }}
                  label={index === 0 ? 'Cant.' : undefined}
                  value={item.quantity}
                  onChange={(value) => updateItem(item.id, 'quantity', Number(value))}
                  min={1}
                />
                <NumberInput
                  style={{ width: 120 }}
                  label={index === 0 ? 'Precio' : undefined}
                  value={item.unitPrice}
                  onChange={(value) => updateItem(item.id, 'unitPrice', Number(value))}
                  prefix="$"
                  min={0}
                />
                <NumberInput
                  style={{ width: 120 }}
                  label={index === 0 ? 'Subtotal' : undefined}
                  value={item.quantity * item.unitPrice}
                  prefix="$"
                  disabled
                />
                {(newBudget.items || []).length > 1 && (
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

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <NumberInput
              label="Descuento (%)"
              value={newBudget.discount || 0}
              onChange={(value) => setNewBudget({ ...newBudget, discount: Number(value) })}
              min={0}
              max={100}
              suffix="%"
            />
            <Textarea
              label="Notas"
              placeholder="Condiciones, tiempos, etc..."
              value={newBudget.notes || ''}
              onChange={(e) => setNewBudget({ ...newBudget, notes: e.target.value })}
              rows={2}
            />
          </SimpleGrid>

          <Paper p="md" radius="md" style={{ background: 'var(--mantine-color-gray-0)' }}>
            <SimpleGrid cols={4}>
              <Box>
                <Text size="sm" c="dimmed">Subtotal</Text>
                <Text fw={600}>${calculateSubtotal(newBudget.items || []).toLocaleString()}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Descuento</Text>
                <Text fw={600} c="red">-{(newBudget.discount || 0)}%</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Ahorro</Text>
                <Text fw={600} c="green">${(calculateSubtotal(newBudget.items || []) * ((newBudget.discount || 0) / 100)).toLocaleString()}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Total</Text>
                <Text fw={700} size="lg" c="blue">
                  ${calculateTotal(newBudget.items || [], newBudget.discount || 0).toLocaleString()}
                </Text>
              </Box>
            </SimpleGrid>
          </Paper>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={createBudget}
              disabled={!newBudget.title || !newBudget.clientName || !newBudget.items?.some(i => i.description)}
            >
              Crear Presupuesto
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}

export default function BudgeterPage() {
  return (
    <Suspense fallback={<BudgeterLoader />}>
      <BudgeterContent />
    </Suspense>
  )
}