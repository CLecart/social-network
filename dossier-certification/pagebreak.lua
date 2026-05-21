-- Insère un saut de page avant chaque titre de niveau 1
function Header(el)
  if el.level == 1 then
    return {pandoc.RawBlock('latex', '\\newpage'), el}
  end
end
