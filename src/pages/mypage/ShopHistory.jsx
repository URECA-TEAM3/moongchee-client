import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShopHistory = () => {

    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    // 구매 내역 데이터 (예시)
    const items = [
        { id: 1, title: '순우리 국산 개껌 (4개입)', quantity: 1, points: 50 },
        { id: 2, title: '슈퍼포우 오메가3 120ml', quantity: 1, points: 50 },
        { id: 3, title: '순우리 국산 개껌 (4개입)', quantity: 1, points: 50 },
    ];

    return (
        <div>
            <div>
                <div className="relative w-full flex items-center mb-4 mt-6">
                    <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
                        <ChevronLeftIcon className="h-6 w-6 ml-5" stroke="black" />
                    </button>
                    <h1 className="mx-auto text-lg font-bold ">구매 / 취소 내역</h1>
                </div>
            </div>

            <div className='pt-3 pb-7 pl-10 pr-10'>
                
                <div className='w-full bg-white rounded-lg p-5 shadow mb-5 flex justify-between items-center'>
                    <div className='w-full flex flex-col justify-between'>
                        <div className='flex w-full justify-between items-center'>
                            <div className='flex items-center'>
                                <span className='text-lg font-bold mb-1'>2024.09.18</span>
                                <span className='text-alert text-sm font-normal ml-2'>환불요청</span>
                            </div>
                            <div>
                                <button onClick={toggleExpand}>
                                    {isExpanded ? (
                                        <div className='flex'>
                                            <span className='mr-1'>순우리 국산 개껌 (4개입)</span>
                                            <span className='text-primary mr-1'> 외 3개</span>
                                            <ChevronDownIcon className='h-6 w-6' stroke='black' />
                                        </div>
                                    ) : (
                                        <ChevronUpIcon className='h-6 w-6' stroke='black' />
                                    )}

                                </button>
                            </div>
                        </div>
                        <div className='flex mt-2'>
                            <img src='/src/assets/images/dog.jpeg' className='w-20 h-20 rounded-lg' />
                            <div className='p-4'>
                                <span>순우리 국산 개껌 (4개입)</span>
                                {!isExpanded && (
                                    <span className='text-primary'> 외 3개</span>
                                )}
                                <div className='p-1 flex'>
                                    <img src='/src/assets/images/dogChew.svg' className='w-6 h-6 rounded-full' />
                                    <p className='ml-2 font-bold'>750개</p>
                                </div>
                            </div>
                        </div>

                        {/* History detail */}
                        {isExpanded && (
                            <div>
                                {items.map((item) => (
                                    <div key={item.id} className='flex items-center'>
                                        <img src='/src/assets/images/dog.jpeg' className='w-20 h-20 rounded-lg' />
                                        <div className='p-4'>
                                            <p>{item.title}</p>
                                            <p>수량 : {item.quantity}개</p>
                                            <div className='flex'>
                                                <img src='/src/assets/images/dogChew.svg' className='w-6 h-6 rounded-full' />
                                                <p className='ml-2 font-bold'>{item.points}개</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

            </div>
            
        </div>
    );
};

export default ShopHistory;