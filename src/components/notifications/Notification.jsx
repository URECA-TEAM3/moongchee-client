import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import API from '../../api/axiosInstance';



const Notification = () => {

    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userId, setUserId] = useState(0);
    const [notiLength, setNotiLength] = useState(0);

    useEffect(() => {
        const userData = sessionStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            fetchNotifications(parsedData.id);
            setUserId(parsedData.id);
        }
    }, []);

    const fetchNotifications = async (userId) => {
        try {
            const response = await API.get(`/notifications/${userId}`);
            const notiData = response.data.data;
            setNotifications(notiData);
            setNotiLength(notiData.length);
        } catch (error) {
            console.error(error);
        }
    }
    
    const toggleDropdown = async () => {
        setIsDropdownOpen(!isDropdownOpen);
        setNotiLength(0);
        
        if (!isDropdownOpen) {
            console.log('ok')
            await notificationAllRead();
        }
    };
    
    const NotificationMessage = (notification) => {
        const {sending_name, type} = notification;
        switch (type) {
            case 'request':
                return `${sending_name} 님으로부터 펫시터 서비스 예약 요청이 있습니다.`;
            case 'denied':
                return `${sending_name} 펫시터님이 펫시터 예약 요청을 거절하였습니다.`;
            case 'confirmed':
                return `${sending_name} 펫시터님이 펫시터 예약 요청을 수락하였습니다.`;
            case 'canceled':
                return `${sending_name} 님이 펫시터 서비스 예약을 취소하였습니다.`;
            default:
                return '알 수 없는 알림입니다.';
        }
    }
                        
    // 알림 전체 읽음 처리
    const notificationAllRead = async () => {
        try {
            await API.put('/notifications/delete-all', {id: userId, status: "read"});
            // setNotifications([]);
                                
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='mt-2 relative'>
            <button onClick={toggleDropdown} className='relative'>
                <BellIcon className="size-7" />
                {notiLength > 0 ? (
                    <span className='absolute top-0 right-0 bg-alert text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>{notifications.length}</span>
                ) : (<></>)}
            </button>

            {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-96 bg-white border border-primary rounded-lg shadow-lg p-2'>
                    <div className='p-4 flex justify-between items-center'>
                        <h3 className='text-lg'>알림 {notifications.length}</h3>
                    </div>

                    <div className='divide-y divide-gray-200'>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div key={index} className='p-4 flex justify-between items-center'>
                                    <p className='text-sm'>{NotificationMessage(notification)}</p>
                                </div>
                            )
                        )) : (
                            <div className='p-4 text-sm text-gray-500 text-center'>새로운 알림이 없습니다.</div>
                        )}
                    </div>
                </div>

            )}

        </div>
    );
};

export default Notification;