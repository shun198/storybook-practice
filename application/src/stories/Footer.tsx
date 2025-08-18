import React from 'react';
import './footer.css';

export interface FooterProps {
  /** フッターに表示するテキスト */
  text: string;
  /** リンクのラベル */
  linkLabel?: string;
  /** リンクのURL */
  linkUrl?: string;
  /** ボタンのラベル */
  buttonLabel?: string;
  /** ボタン押下時のハンドラ */
  onButtonClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  text,
  linkLabel,
  linkUrl,
  buttonLabel,
  onButtonClick,
}) => (
  <footer className="storybook-footer">
    <div className="footer-content">
      <span>{text}</span>
      {linkLabel && linkUrl && (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
          {linkLabel}
        </a>
      )}
      {buttonLabel && (
        <button className="footer-button" onClick={onButtonClick} type="button">
          {buttonLabel}
        </button>
      )}
    </div>
  </footer>
);
