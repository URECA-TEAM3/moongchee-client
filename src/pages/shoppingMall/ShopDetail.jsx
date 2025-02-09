import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import DetailBottom from '../../components/shop/DetailBottom';
import { getProductDetail } from '../../api/product';

function ShopDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await getProductDetail(id);
        setProduct(response.data.data);
        const productData = response.data.data;

        const imageRef = ref(storage, productData.image);
        const descriptionRef = ref(storage, productData.description);

        const [imageUrl, descriptionUrl] = await Promise.all([
          getDownloadURL(imageRef), // 이미지 URL
          getDownloadURL(descriptionRef), // 설명 URL
        ]);
        setProduct({
          ...productData,
          image: imageUrl,
          description: descriptionUrl,
        });
      } catch (err) {
        console.error('상품 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  return (
    <>
      <div className="bg-white relative">
        <div className="flex items-center justify-between p-5">
          <button onClick={() => navigate('/shoppingmall')}>
            <IoIosArrowBack />
          </button>
          <div>상품정보</div>
          <div></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            <img src={product.image} alt={product.name} />
            <div className="p-7">
              <h1 className="text-xl break-keep">{product.name}</h1>
              <p className="flex items-center mt-3">
                <img className="w-8 mr-1" src="/assets/images/dogChew.svg" alt="" />
                <span className="font-bold">{product.price}개</span>
              </p>
            </div>
            <img src={product.description} alt={product.name} />
          </div>
        )}

        <DetailBottom id={id} product={product} />
      </div>
    </>
  );
}

export default ShopDetail;
