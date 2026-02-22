'use client'

import { Suspense, useState } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, Tabs, ThemeIcon, Box, Badge, ActionIcon, UnstyledButton, Modal, TextInput, Textarea, Divider, NumberInput } from '@mantine/core'
import { IoDocuments, IoAdd, IoDownload, IoEye, IoTime, IoCheckmarkCircle, IoCalendar, IoTrash, IoBriefcase } from 'react-icons/io5'
import { jsPDF } from 'jspdf'

function ReportsLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

interface DevelopmentPoint {
  id: string
  title: string
  description: string
}

interface ProjectReport {
  id: string
  name: string
  projectName: string
  clientName: string
  clientRequirements: string
  developmentPoints: DevelopmentPoint[]
  status: 'pendiente' | 'en_progreso' | 'completado'
  createdAt: string
}

const initialReports: ProjectReport[] = [
  {
    id: '1',
    name: 'Informe de Avance - Enero 2026',
    projectName: 'Campaña Alpha',
    clientName: 'Cliente Alpha',
    clientRequirements: 'Desarrollo de campaña publicitaria para redes sociales con enfoque en generación de leads.',
    developmentPoints: [
      { id: '1', title: 'Estrategia de contenido', description: 'Planificación de contenido mensual para Instagram y Facebook' },
      { id: '2', title: 'Diseño gráfico', description: 'Creación de piezas visuales para campaña' },
    ],
    status: 'completado',
    createdAt: '2026-02-01'
  },
  {
    id: '2',
    name: 'Reporte de Proyecto Beta',
    projectName: 'Proyecto Beta',
    clientName: 'Beta Corp',
    clientRequirements: 'Rediseño completo de sitio web corporativo con integración de e-commerce.',
    developmentPoints: [
      { id: '1', title: 'Análisis UX', description: 'Investigación de usuarios y propuesta de arquitectura' },
      { id: '2', title: 'Diseño UI', description: 'Diseño de interfaces para desktop y móvil' },
      { id: '3', title: 'Desarrollo Frontend', description: 'Implementación en React/Next.js' },
    ],
    status: 'en_progreso',
    createdAt: '2026-02-15'
  },
]

function ReportsContent() {
  const [reports, setReports] = useState<ProjectReport[]>(initialReports)
  const [modalOpened, setModalOpened] = useState(false)
  const [viewModalOpened, setViewModalOpened] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ProjectReport | null>(null)

  const [newReport, setNewReport] = useState<Partial<ProjectReport>>({
    name: '',
    projectName: '',
    clientName: '',
    clientRequirements: '',
    developmentPoints: [{ id: '1', title: '', description: '' }]
  })

  const statusColors: Record<string, string> = {
    completado: 'green',
    en_progreso: 'blue',
    pendiente: 'orange'
  }

  const statusLabels: Record<string, string> = {
    completado: 'Completado',
    en_progreso: 'En Progreso',
    pendiente: 'Pendiente'
  }

  const addDevelopmentPoint = () => {
    const points = newReport.developmentPoints || []
    setNewReport({
      ...newReport,
      developmentPoints: [...points, { id: Date.now().toString(), title: '', description: '' }]
    })
  }

  const removeDevelopmentPoint = (id: string) => {
    const points = (newReport.developmentPoints || []).filter(p => p.id !== id)
    setNewReport({ ...newReport, developmentPoints: points })
  }

  const updateDevelopmentPoint = (id: string, field: 'title' | 'description', value: string) => {
    const points = (newReport.developmentPoints || []).map(p =>
      p.id === id ? { ...p, [field]: value } : p
    )
    setNewReport({ ...newReport, developmentPoints: points })
  }

  const createReport = () => {
    const report: ProjectReport = {
      id: Date.now().toString(),
      name: newReport.name || '',
      projectName: newReport.projectName || '',
      clientName: newReport.clientName || '',
      clientRequirements: newReport.clientRequirements || '',
      developmentPoints: newReport.developmentPoints || [],
      status: 'pendiente',
      createdAt: new Date().toISOString().split('T')[0]
    }
    setReports([report, ...reports])
    setModalOpened(false)
    setNewReport({
      name: '',
      projectName: '',
      clientName: '',
      clientRequirements: '',
      developmentPoints: [{ id: '1', title: '', description: '' }]
    })
  }

  const deleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id))
  }

  const updateStatus = (id: string, status: 'pendiente' | 'en_progreso' | 'completado') => {
    setReports(reports.map(r => r.id === id ? { ...r, status } : r))
  }

  const generatePDF = (report: ProjectReport) => {
    const doc = new jsPDF()

    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246)
    doc.text('INFORME DE PROYECTO', 105, 25, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(report.name, 105, 35, { align: 'center' })

    doc.setDrawColor(200, 200, 200)
    doc.line(20, 45, 190, 45)

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.text('INFORMACIÓN GENERAL', 20, 55)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Proyecto: ${report.projectName}`, 20, 65)
    doc.text(`Cliente: ${report.clientName}`, 20, 72)
    doc.text(`Fecha: ${report.createdAt}`, 20, 79)

    let yPos = 95

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.text('REQUERIMIENTOS DEL CLIENTE', 20, yPos)
    
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    const requirementsLines = doc.splitTextToSize(report.clientRequirements, 170)
    doc.text(requirementsLines, 20, yPos + 10)
    yPos += 10 + (requirementsLines.length * 6) + 15

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.text('PUNTOS A DESARROLLAR', 20, yPos)
    yPos += 10

    report.developmentPoints.forEach((point, index) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setTextColor(59, 130, 246)
      doc.setFontSize(10)
      doc.text(`${index + 1}. ${point.title}`, 20, yPos)
      yPos += 7

      doc.setTextColor(100, 100, 100)
      doc.setFontSize(9)
      const descLines = doc.splitTextToSize(point.description, 160)
      doc.text(descLines, 25, yPos)
      yPos += (descLines.length * 5) + 8
    })

    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Generado por Aion Publisher', 105, 285, { align: 'center' })

    doc.save(`${report.name.replace(/\s+/g, '_')}.pdf`)
  }

  const viewReport = (report: ProjectReport) => {
    setSelectedReport(report)
    setViewModalOpened(true)
  }

  const completedCount = reports.filter(r => r.status === 'completado').length
  const pendingCount = reports.filter(r => r.status === 'pendiente').length
  const inProgressCount = reports.filter(r => r.status === 'en_progreso').length

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoDocuments size={28} />
            <Title order={2}>Informes de Proyecto</Title>
          </Group>
          <Button leftSection={<IoAdd size={18} />} onClick={() => setModalOpened(true)}>
            Crear Informe
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Completados</Text>
              <ThemeIcon variant="light" color="green"><IoCheckmarkCircle size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{completedCount}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">En Progreso</Text>
              <ThemeIcon variant="light" color="blue"><IoTime size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{inProgressCount}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Pendientes</Text>
              <ThemeIcon variant="light" color="orange"><IoCalendar size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{pendingCount}</Text>
          </Paper>
        </SimpleGrid>

        <Tabs defaultValue="todos">
          <Tabs.List>
            <Tabs.Tab value="todos">Todos</Tabs.Tab>
            <Tabs.Tab value="pendientes">Pendientes</Tabs.Tab>
            <Tabs.Tab value="progreso">En Progreso</Tabs.Tab>
            <Tabs.Tab value="completados">Completados</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="todos" pt="md">
            <ReportsList 
              reports={reports} 
              statusColors={statusColors}
              statusLabels={statusLabels}
              onView={viewReport}
              onDownload={generatePDF}
              onDelete={deleteReport}
              onUpdateStatus={updateStatus}
            />
          </Tabs.Panel>

          <Tabs.Panel value="pendientes" pt="md">
            <ReportsList 
              reports={reports.filter(r => r.status === 'pendiente')} 
              statusColors={statusColors}
              statusLabels={statusLabels}
              onView={viewReport}
              onDownload={generatePDF}
              onDelete={deleteReport}
              onUpdateStatus={updateStatus}
            />
          </Tabs.Panel>

          <Tabs.Panel value="progreso" pt="md">
            <ReportsList 
              reports={reports.filter(r => r.status === 'en_progreso')} 
              statusColors={statusColors}
              statusLabels={statusLabels}
              onView={viewReport}
              onDownload={generatePDF}
              onDelete={deleteReport}
              onUpdateStatus={updateStatus}
            />
          </Tabs.Panel>

          <Tabs.Panel value="completados" pt="md">
            <ReportsList 
              reports={reports.filter(r => r.status === 'completado')} 
              statusColors={statusColors}
              statusLabels={statusLabels}
              onView={viewReport}
              onDownload={generatePDF}
              onDelete={deleteReport}
              onUpdateStatus={updateStatus}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={600} size="lg">Nuevo Informe de Proyecto</Text>}
        size="xl"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">Crea un nuevo informe con los requerimientos del cliente y puntos a desarrollar</Text>
          
          <Divider label="Información General" labelPosition="left" />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput 
              label="Nombre del informe" 
              placeholder="Ej: Informe de Avance - Febrero 2026"
              value={newReport.name || ''}
              onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
              required
            />
            <TextInput 
              label="Nombre del proyecto" 
              placeholder="Ej: Campaña Marketing Q1"
              value={newReport.projectName || ''}
              onChange={(e) => setNewReport({ ...newReport, projectName: e.target.value })}
              required
            />
            <TextInput 
              label="Cliente" 
              placeholder="Nombre del cliente"
              value={newReport.clientName || ''}
              onChange={(e) => setNewReport({ ...newReport, clientName: e.target.value })}
              required
            />
          </SimpleGrid>

          <Divider label="Requerimientos del Cliente" labelPosition="left" />
          <Textarea
            label="Descripción de requerimientos"
            placeholder="Describe los requerimientos y expectativas del cliente para este proyecto..."
            value={newReport.clientRequirements || ''}
            onChange={(e) => setNewReport({ ...newReport, clientRequirements: e.target.value })}
            rows={4}
            required
          />

          <Divider label="Puntos a Desarrollar" labelPosition="left" />
          <Stack gap="xs">
            {(newReport.developmentPoints || []).map((point, index) => (
              <Paper key={point.id} p="sm" radius="md" style={{ background: 'var(--mantine-color-gray-0)' }}>
                <Group align="flex-start" gap="sm">
                  <ThemeIcon size={24} radius="xl" variant="light" color="blue">
                    <Text size="xs" fw={700}>{index + 1}</Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <TextInput
                      placeholder="Título del punto a desarrollar"
                      value={point.title}
                      onChange={(e) => updateDevelopmentPoint(point.id, 'title', e.target.value)}
                      mb="xs"
                    />
                    <Textarea
                      placeholder="Descripción breve de este punto..."
                      value={point.description}
                      onChange={(e) => updateDevelopmentPoint(point.id, 'description', e.target.value)}
                      rows={2}
                    />
                  </Box>
                  {(newReport.developmentPoints || []).length > 1 && (
                    <ActionIcon color="red" variant="subtle" onClick={() => removeDevelopmentPoint(point.id)}>
                      <IoTrash size={18} />
                    </ActionIcon>
                  )}
                </Group>
              </Paper>
            ))}
            <Button variant="light" leftSection={<IoAdd size={16} />} onClick={addDevelopmentPoint} size="sm">
              Agregar punto a desarrollar
            </Button>
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={createReport}
              disabled={!newReport.name || !newReport.projectName || !newReport.clientName || !newReport.clientRequirements}
            >
              Crear Informe
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title={<Text fw={600} size="lg">{selectedReport?.name}</Text>}
        size="lg"
      >
        {selectedReport && (
          <Stack gap="md">
            <SimpleGrid cols={2} spacing="md">
              <Box>
                <Text size="sm" c="dimmed">Proyecto</Text>
                <Text fw={500}>{selectedReport.projectName}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Cliente</Text>
                <Text fw={500}>{selectedReport.clientName}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Fecha</Text>
                <Text fw={500}>{selectedReport.createdAt}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Estado</Text>
                <Badge color={statusColors[selectedReport.status]} variant="light">
                  {statusLabels[selectedReport.status]}
                </Badge>
              </Box>
            </SimpleGrid>

            <Divider label="Requerimientos del Cliente" labelPosition="left" />
            <Paper p="md" radius="md" style={{ background: 'var(--mantine-color-gray-0)' }}>
              <Text size="sm">{selectedReport.clientRequirements}</Text>
            </Paper>

            <Divider label="Puntos a Desarrollar" labelPosition="left" />
            <Stack gap="sm">
              {selectedReport.developmentPoints.map((point, index) => (
                <Paper key={point.id} p="sm" radius="md" style={{ background: 'var(--mantine-color-gray-0)' }}>
                  <Group gap="sm" align="flex-start">
                    <ThemeIcon size={24} radius="xl" variant="light" color="blue">
                      <Text size="xs" fw={700}>{index + 1}</Text>
                    </ThemeIcon>
                    <Box>
                      <Text fw={500}>{point.title}</Text>
                      <Text size="sm" c="dimmed">{point.description}</Text>
                    </Box>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setViewModalOpened(false)}>
                Cerrar
              </Button>
              <Button leftSection={<IoDownload size={18} />} onClick={() => generatePDF(selectedReport)}>
                Descargar PDF
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  )
}

interface ReportsListProps {
  reports: ProjectReport[]
  statusColors: Record<string, string>
  statusLabels: Record<string, string>
  onView: (report: ProjectReport) => void
  onDownload: (report: ProjectReport) => void
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: 'pendiente' | 'en_progreso' | 'completado') => void
}

function ReportsList({ reports, statusColors, statusLabels, onView, onDownload, onDelete, onUpdateStatus }: ReportsListProps) {
  if (reports.length === 0) {
    return (
      <Paper shadow="xs" p="xl" radius="md">
        <Text c="dimmed" ta="center">No hay informes en esta categoría</Text>
      </Paper>
    )
  }

  return (
    <Paper shadow="xs" radius="md">
      <Stack gap={0}>
        {reports.map((report, index) => (
          <Box key={report.id}>
            <Group justify="space-between" p="md">
              <Group>
                <ThemeIcon variant="light" color="blue">
                  <IoDocuments size={18} />
                </ThemeIcon>
                <Box>
                  <Text fw={500}>{report.name}</Text>
                  <Text size="sm" c="dimmed">{report.projectName} • {report.clientName}</Text>
                </Box>
              </Group>
              <Group>
                <Badge color={statusColors[report.status]} variant="light">
                  {statusLabels[report.status]}
                </Badge>
                <Text size="sm" c="dimmed">{report.createdAt}</Text>
                <ActionIcon variant="subtle" color="blue" onClick={() => onView(report)} title="Ver detalle">
                  <IoEye size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" onClick={() => onDownload(report)} title="Descargar PDF">
                  <IoDownload size={18} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="red" onClick={() => onDelete(report.id)} title="Eliminar">
                  <IoTrash size={18} />
                </ActionIcon>
              </Group>
            </Group>
            {index < reports.length - 1 && <Divider />}
          </Box>
        ))}
      </Stack>
    </Paper>
  )
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsLoader />}>
      <ReportsContent />
    </Suspense>
  )
}