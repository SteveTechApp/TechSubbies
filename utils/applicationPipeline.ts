import { Application, ApplicationStatus } from '../types';

export type ApplicationPipelineFilter = 'all' | 'review' | 'offered' | 'hired' | 'rejected';

export const applicationPipelineFilters: Array<{
    id: ApplicationPipelineFilter;
    label: string;
}> = [
    { id: 'all', label: 'All' },
    { id: 'review', label: 'In review' },
    { id: 'offered', label: 'Offered' },
    { id: 'hired', label: 'Hired' },
    { id: 'rejected', label: 'Rejected' },
];

export function matchesApplicationPipeline(
    status: ApplicationStatus,
    filter: ApplicationPipelineFilter
): boolean {
    if (filter === 'all') return true;
    if (filter === 'review') {
        return status === ApplicationStatus.APPLIED || status === ApplicationStatus.VIEWED;
    }
    if (filter === 'offered') return status === ApplicationStatus.OFFERED;
    if (filter === 'hired') {
        return status === ApplicationStatus.HIRED || status === ApplicationStatus.COMPLETED;
    }
    return status === ApplicationStatus.REJECTED;
}

export function getApplicationPipelineCounts(applications: Application[]) {
    return applicationPipelineFilters.reduce<Record<ApplicationPipelineFilter, number>>(
        (counts, filter) => ({
            ...counts,
            [filter.id]: applications.filter(application =>
                matchesApplicationPipeline(application.status, filter.id)
            ).length,
        }),
        { all: 0, review: 0, offered: 0, hired: 0, rejected: 0 }
    );
}
