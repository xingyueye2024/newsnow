import { AiAssistantLinks } from "./ai-assistant-links";
const copy={"title": "向 AI 了解 {name}", "description": "从想法到上手，让 AI 帮你了解 {name} 适合怎样使用。", "note": "将在新标签页打开预设问题。最新信息以本站为准。", "resources_title": "供 AI 助手参考", "index": "产品信息与页面索引", "full": "扩展网站内容", "sitemap": "公开页面与语言", "prompt": "请根据 {site} 及其链接的公开页面，介绍 {name} 提供什么、适合谁、怎样开始使用。请附上来源链接，并以本站为准核对最新价格。无法访问的资料请明确说明。请用简体中文回答。"};
export function AskAi(){return <AiAssistantLinks name="NewsNow" site="https://allnews.pro" copy={copy} resources={["/sitemap.xml"]}/>;}
