import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue
} from '@chakra-ui/react';
import { DashboardLayout, DashboardGridItem } from '../layout/DashboardLayout';
import { TaskList } from '../tasks/TaskList';
import { TaskForm } from '../tasks/TaskForm';
import { NotificationList } from '../notifications/NotificationList';
import { AnalyticsCard } from '../analytics/AnalyticsCard';
import { AnalyticsChart, ChartType } from '../analytics/AnalyticsChart';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { Notification, NotificationType } from '../../types/notification';

// Sample data for demonstration
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write and review the Q1 project proposal document',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-02-15',
    tags: ['work', 'urgent'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Team meeting preparation',
    description: 'Prepare agenda and materials for weekly team sync',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-02-10',
    tags: ['meeting', 'planning'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Code review',
    description: 'Review pull request for authentication feature',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-02-08',
    tags: ['code', 'review'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task Due Soon',
    message: 'Your task "Complete project proposal" is due in 2 days.',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/tasks/1',
    actionLabel: 'View Task'
  },
  {
    id: '2',
    title: 'New Team Message',
    message: 'Sarah commented on your task "Team meeting preparation"',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/tasks/2',
    actionLabel: 'View Task'
  },
  {
    id: '3',
    title: 'Task Completed',
    message: 'Congratulations! You completed "Code review"',
    type: 'success',
    read: true,
    createdAt: new Date().toISOString()
  }
];

export const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [chartType, setChartType] = useState<ChartType>('line');

  const bgColor = useColorModeValue('gray.50', 'gray.800');

  // Task handlers
  const handleCreateTask = (data: any) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...data,
      status: data.status as TaskStatus,
      priority: data.priority as TaskPriority,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    onClose();
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      onOpen();
    }
  };

  const handleUpdateTask = (data: any) => {
    if (selectedTask) {
      setTasks(prev => prev.map(task =>
        task.id === selectedTask.id
          ? { ...task, ...data, updatedAt: new Date().toISOString() }
          : task
      ));
      setSelectedTask(undefined);
      onClose();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Analytics data
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length
  };

  const chartData = [
    {
      name: 'Tasks by Status',
      data: [
        { label: 'Todo', value: taskStats.todo },
        { label: 'In Progress', value: taskStats.inProgress },
        { label: 'Completed', value: taskStats.completed }
      ]
    }
  ];

  const productivityData = [
    {
      name: 'Weekly Progress',
      data: [
        { label: 'Mon', value: 3 },
        { label: 'Tue', value: 5 },
        { label: 'Wed', value: 2 },
        { label: 'Thu', value: 7 },
        { label: 'Fri', value: 4 },
        { label: 'Sat', value: 1 },
        { label: 'Sun', value: 2 }
      ]
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      {/* Analytics Overview */}
      <DashboardGridItem>
        <AnalyticsCard
          title="Total Tasks"
          value={taskStats.total}
          icon="📋"
          colorScheme="blue"
        />
      </DashboardGridItem>

      <DashboardGridItem>
        <AnalyticsCard
          title="Completed Tasks"
          value={taskStats.completed}
          icon="✅"
          colorScheme="green"
          change={Math.round((taskStats.completed / taskStats.total) * 100)}
          changeLabel="completion rate"
        />
      </DashboardGridItem>

      <DashboardGridItem>
        <AnalyticsCard
          title="In Progress"
          value={taskStats.inProgress}
          icon="🔄"
          colorScheme="orange"
        />
      </DashboardGridItem>

      <DashboardGridItem>
        <AnalyticsCard
          title="Unread Notifications"
          value={notifications.filter(n => !n.read).length}
          icon="🔔"
          colorScheme="purple"
        />
      </DashboardGridItem>

      {/* Task Status Chart */}
      <DashboardGridItem colSpan={{ base: 1, md: 2, lg: 2, xl: 2 }}>
        <AnalyticsChart
          title="Task Distribution"
          description="Current status of all tasks"
          type={chartType}
          series={chartData}
          height={300}
          allowTypeChange={true}
          onTypeChange={setChartType}
        />
      </DashboardGridItem>

      {/* Productivity Chart */}
      <DashboardGridItem colSpan={{ base: 1, md: 2, lg: 2, xl: 2 }}>
        <AnalyticsChart
          title="Weekly Productivity"
          description="Tasks completed this week"
          type="bar"
          series={productivityData}
          height={300}
        />
      </DashboardGridItem>

      {/* Main Content Tabs */}
      <DashboardGridItem colSpan={{ base: 1, md: 4, lg: 4, xl: 4 }}>
        <Box
          bg={useColorModeValue('white', 'gray.700')}
          borderRadius="lg"
          shadow="sm"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <Tabs variant="enclosed" colorScheme="brand">
            <TabList>
              <Tab>Tasks</Tab>
              <Tab>Notifications</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" p={4} borderBottom="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                    <Text fontSize="lg" fontWeight="semibold">Task Management</Text>
                    <Button colorScheme="brand" size="sm" onClick={() => { setSelectedTask(undefined); onOpen(); }}>
                      Add Task
                    </Button>
                  </HStack>
                  <Box p={4}>
                    <TaskList
                      tasks={tasks}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  </Box>
                </VStack>
              </TabPanel>

              <TabPanel p={0}>
                <NotificationList
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onClearAll={handleClearAllNotifications}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </DashboardGridItem>

      {/* Task Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedTask ? 'Edit Task' : 'Create New Task'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <TaskForm
              task={selectedTask}
              onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
};
