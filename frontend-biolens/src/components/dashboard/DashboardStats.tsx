'use client'
import { SimpleGrid } from '@chakra-ui/react'
import { StatCard } from '@/components/shared/StatCard'
import type { DiagnosisStats } from '@/types'

interface DashboardStatsProps {
  stats: DiagnosisStats
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <SimpleGrid columns={{ base: 2, xl: 4 }} gap="4">
    <StatCard label="Active fields" value={stats.activeFields} helpText="1 new this week"  trend="up" />
    <StatCard label="Total scans"   value={stats.totalScans}   helpText="12% this month"   trend="up" />
    <StatCard label="Issues found"  value={stats.issuesFound}  helpText="3 this week"      trend="up" />
    <StatCard label="Treated"       value={stats.treated}      helpText="Last: 2 days ago" />
  </SimpleGrid>
)
