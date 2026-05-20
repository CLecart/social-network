-- Remplace chaque image par un \includegraphics avec contraintes
-- width max = largeur du texte, height max = 75% de la page
-- keepaspectratio préserve les proportions sans déformer
function Image(el)
  local src = el.src
  local caption = pandoc.utils.stringify(el.caption)
  local latex = string.format(
    '\\begin{figure}[H]\n\\centering\n' ..
    '\\includegraphics[width=\\linewidth,height=0.75\\textheight,keepaspectratio]{%s}\n' ..
    '\\caption{%s}\n\\end{figure}',
    src, caption
  )
  return pandoc.RawInline('latex', latex)
end
