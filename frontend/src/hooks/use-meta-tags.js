import { useEffect } from 'react';

/**
 * Setter eller oppdaterer dokument meta-tags når komponenten mountes.
 * Bot-er som ikke kjører JS (FB, LinkedIn) bruker /index.html-default,
 * mens nyere bot-er (Twitter, Discord, Slack) leser de oppdaterte verdiene.
 */
export const useMetaTags = ({ title, description, image, url }) => {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (selector, attr, value) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [key, val] = selector.replace(/[[\]"]/g, '').split('=');
        el.setAttribute(key, val);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
      setMeta('meta[name="twitter:description"]', 'content', description);
    }
    if (title) {
      setMeta('meta[property="og:title"]', 'content', title);
      setMeta('meta[name="twitter:title"]', 'content', title);
    }
    if (image) {
      setMeta('meta[property="og:image"]', 'content', image);
      setMeta('meta[name="twitter:image"]', 'content', image);
    }
    if (url) {
      setMeta('meta[property="og:url"]', 'content', url);
    }
  }, [title, description, image, url]);
};
