import { useCallback } from 'react';

export interface PaymentLink {
  id: string;
  name: string;
  amount: number;
  image?: string; // Base64 encoded image
  status: 'Gözləmədə' | 'ÖDƏNİLDİ' | 'Tamamlandı';
  createdAt: number;
}

const LINKS_STORAGE_KEY = 'klink_links';

export const useLinks = () => {
  const getLinks = useCallback((): PaymentLink[] => {
    try {
      const linksJson = localStorage.getItem(LINKS_STORAGE_KEY);
      if (!linksJson) return [];
      const links = JSON.parse(linksJson) as PaymentLink[];
      // Sort by newest first
      return links.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Failed to parse links from localStorage", error);
      return [];
    }
  }, []);

  const getLinkById = useCallback((id: string): PaymentLink | undefined => {
    const links = getLinks();
    return links.find(link => link.id === id);
  }, [getLinks]);

  const addLink = useCallback((linkData: { name: string; amount: number; image?: string }) => {
    const linksJson = localStorage.getItem(LINKS_STORAGE_KEY);
    const existingLinks = linksJson ? JSON.parse(linksJson) : [];
    
    const newLink: PaymentLink = {
      id: `O_${Date.now()}`,
      ...linkData,
      status: 'Gözləmədə',
      createdAt: Date.now(),
    };
    const updatedLinks = [newLink, ...existingLinks];
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));
  }, []);

  const updateLinkStatus = useCallback((id: string, status: 'ÖDƏNİLDİ' | 'Tamamlandı') => {
    const linksJson = localStorage.getItem(LINKS_STORAGE_KEY);
    const links = linksJson ? (JSON.parse(linksJson) as PaymentLink[]) : [];

    const linkIndex = links.findIndex((link: PaymentLink) => link.id === id);
    if (linkIndex > -1) {
        links[linkIndex].status = status;
        localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));

        // If payment is made, simulate clearing period then complete it.
        if (status === 'ÖDƏNİLDİ') {
            setTimeout(() => {
                // Re-fetch to ensure we have the latest data
                const currentLinksJson = localStorage.getItem(LINKS_STORAGE_KEY);
                const currentLinks = currentLinksJson ? (JSON.parse(currentLinksJson) as PaymentLink[]) : [];
                const currentIndex = currentLinks.findIndex((link: PaymentLink) => link.id === id);
                if (currentIndex > -1 && currentLinks[currentIndex].status === 'ÖDƏNİLDİ') {
                    currentLinks[currentIndex].status = 'Tamamlandı';
                    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(currentLinks));
                }
            }, 15000); // 15-second clearing simulation
        }
    }
  }, []);

  return { getLinks, getLinkById, addLink, updateLinkStatus };
};