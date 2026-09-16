import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ConnectedForm } from './forms';
const roots = new WeakMap<Element, ReturnType<typeof hydrateRoot>>();
export function mount(scope: ParentNode = document) {
  const nodes = Array.from(scope.querySelectorAll<HTMLElement>('[data-connected-form]'));
  if(scope instanceof HTMLElement && scope.matches('[data-connected-form]'))nodes.unshift(scope);
  for(const node of nodes) {
    if(roots.has(node))continue;
    const kind=node.dataset.connectedForm!;const placement=node.dataset.placement || 'hero';
    roots.set(node,hydrateRoot(node,<ConnectedForm kind={kind} placement={placement}/>));
  }
}
const previous=(window as any).FivecredConnectedForms;
if(previous){previous.mount();}else{
  (window as any).FivecredConnectedForms={mount};
  const start=()=>{mount();new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node instanceof HTMLElement && (node.matches('[data-connected-form]')||node.querySelector('[data-connected-form]')))mount(node);}).observe(document.body,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
}
