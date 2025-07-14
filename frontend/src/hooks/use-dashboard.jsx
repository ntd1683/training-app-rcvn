import { useEffect, useState } from 'react';
import { getAnalytics } from '../services/api';

export const useDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    
    const currenUser = JSON.parse(localStorage.getItem('user'));
    const userName = currenUser ? currenUser.name : 'Guest';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await getAnalytics();
                if (!response.success) {
                    throw new Error('Failed to fetch dashboard data');
                }
                setTotalUsers(response.data.total_users || 0);
                setTotalProducts(response.data.total_products || 0);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return {
        totalUsers,
        totalProducts,
        userName
    };
}