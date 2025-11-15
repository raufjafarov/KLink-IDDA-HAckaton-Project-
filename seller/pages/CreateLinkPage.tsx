
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLinks } from '../hooks/useLinks';
import { useLocalization } from '../hooks/useLocalization';

const UploadIcon: React.FC = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const CreateLinkPage: React.FC = () => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { t } = useLocalization();
    const navigate = useNavigate();
    const { addLink } = useLinks();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !amount) {
            alert(t('create_link_page.alert.required_fields'));
            return;
        }
        setIsLoading(true);

        let imageBase64: string | undefined = undefined;
        if (imageFile) {
            try {
                imageBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(imageFile);
                });
            } catch (error) {
                console.error("Error converting image to Base64", error);
                setIsLoading(false);
                alert(t('create_link_page.alert.image_error'));
                return;
            }
        }

        addLink({
            name,
            amount: parseFloat(amount),
            image: imageBase64,
        });

        // A slight delay to simulate processing, then navigate
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 300);
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('create_link_page.title')}</h1>
                        <p className="mt-1 text-sm text-gray-600">{t('create_link_page.subtitle')}</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">
                            <div>
                                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">
                                    {t('create_link_page.form.product_name')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="product-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder={t('create_link_page.form.product_name_placeholder')}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                    {t('create_link_page.form.amount')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder={t('create_link_page.form.amount_placeholder')}
                                    required
                                    step="0.01"
                                    min="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('create_link_page.form.product_image')}
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Product preview" className="mx-auto h-24 w-auto object-cover rounded-md" />
                                        ) : (
                                            <UploadIcon />
                                        )}
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>{t('create_link_page.form.upload_image')}</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">{t('create_link_page.form.image_formats')}</p>
                                    </div>
                                </div>
                                {imagePreview && (
                                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="mt-2 text-sm text-red-600 hover:text-red-500">
                                        {t('create_link_page.form.remove_image')}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex justify-center py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                                {isLoading ? t('create_link_page.form.creating_button') : t('create_link_page.form.create_button')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateLinkPage;
