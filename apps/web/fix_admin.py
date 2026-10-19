import re

with open('app/(platform)/admin/page.tsx', 'r') as f:
    content = f.read()

# Fix KpiCard
content = content.replace('''      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
      </div>
    </div>
  );
}''', '''      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}''')

# Fix MiniBar
content = content.replace('''    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}''', '''    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}''')

with open('app/(platform)/admin/page.tsx', 'w') as f:
    f.write(content)
